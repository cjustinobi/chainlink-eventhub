//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

contract EventHubV1 is AutomationCompatibleInterface, VRFConsumerBaseV2, ConfirmedOwner {

     enum Category {
        REFI,
        RENEWABLE_ENERGY,
        AGRICULTURE,
        TECH
    }

    uint256 public totalEvents;
    uint256[] eventIds;

    event NewEventCreated(
        uint256 eventID,
        address creatorAddress,
        uint256 eventTimestamp,
        uint256 maxCapacity,
        uint256 deposit,
        string imagePath
    );

    event Phones(string[] phones);

    event NewRSVP(uint256 eventID, address attendeeAddress);

    event ConfirmedAttendee(uint256 eventID, address attendeeAddress);

    event DepositsPaidOut(uint256 eventID);

    struct CreateEvent {
        string title;
        string imagePath;
        address eventOwner;
        uint256 eventTimestamp;
        uint256 deposit;
        uint256 maxCapacity;
        address[] confirmedRSVPs;
        address[] claimedRSVPs;
        bool paidOut;
        string phone;
    }

    mapping(uint256 => CreateEvent) public idToEvent;

    // Stores indexes of events created by an address.
    mapping(address => uint256[]) addressEventsList;

    // Stores indexes of RSVPs done by an address.
    mapping(address => uint256[]) addressRSVPsList;

      /**
     * Use an interval in seconds and a timestamp to slow execution of Upkeep
     */
    // uint256 public immutable interval;
    // uint256 public lastTimeStamp;

    // constructor(uint256 updateInterval) {
    //     interval = updateInterval;
    //     lastTimeStamp = block.timestamp;
    // }

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;
    uint256 public randomWordsNum;
    address public recentWinner;

    /**
     * HARDCODED FOR Mumbai
     * COORDINATOR: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
     */
    constructor(
        uint64 subscriptionId
    )
        VRFConsumerBaseV2(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(
            0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed
        );
        s_subscriptionId = subscriptionId;
    }

    function createNewEvent(
        string calldata title,
        uint256 eventTimestamp,
        uint256 deposit,
        uint256 maxCapacity,
        string calldata imagePath,
        string calldata phone
       
    ) external payable returns(uint256) {

        uint256 eventId = totalEvents;
        address[] memory confirmedRSVPs;
        address[] memory claimedRSVPs;

        // this creates a new CreateEvent struct and adds it to the idToEvent mapping
        idToEvent[eventId] = CreateEvent(
            title,
            imagePath,
            msg.sender,
            eventTimestamp,
            deposit,
            maxCapacity,
            confirmedRSVPs,
            claimedRSVPs,
            false,
            phone
        );

        emit NewEventCreated(
            eventId,
            msg.sender,
            eventTimestamp,
            maxCapacity,
            deposit,
            imagePath
        );
        totalEvents ++;
        eventIds.push(eventId);
        addressEventsList[msg.sender].push(eventId);
        return eventId;
    }

    function createNewRSVP(uint256 eventId) external payable {
        // look up event from our mapping
        CreateEvent storage myEvent = idToEvent[eventId];

        // transfer deposit to our contract / require that they send in enough ETH to cover the deposit requirement of this specific event
        require(msg.value == myEvent.deposit, "NOT ENOUGH");

        // require that the event hasn't already happened
        require(block.timestamp <= myEvent.eventTimestamp, "ALREADY HAPPENED");

        // make sure event is under max capacity
        require(
            myEvent.confirmedRSVPs.length < myEvent.maxCapacity,
            "This event has reached capacity"
        );

        // require that msg.sender isn't already in myEvent.confirmedRSVPs AKA hasn't already RSVP'd
        for (uint8 i = 0; i < myEvent.confirmedRSVPs.length; i++) {
            require(
                myEvent.confirmedRSVPs[i] != msg.sender,
                "ALREADY CONFIRMED"
            );
        }

        myEvent.confirmedRSVPs.push(payable(msg.sender));
        addressRSVPsList[msg.sender].push(eventId);
        emit NewRSVP(eventId, msg.sender);
    }


    function confirmAllAttendees() public  {
        string[] memory data;
        // Iterate over all event IDs
        for (uint256 i = 0; i < totalEvents; i++) {
            // Look up event from our struct with the eventId
            CreateEvent storage myEvent = idToEvent[eventIds[i]];

            if (block.timestamp >= (myEvent.eventTimestamp + 2 minutes)) {
                    if (!myEvent.paidOut) {
                        for (uint8 j = 0; j < myEvent.confirmedRSVPs.length; j++) {
                            confirmAttendee(eventIds[i], myEvent.confirmedRSVPs[j]);
                        
                            if (!contains(data, myEvent.phone)) {
                                uint256 attended = myEvent.confirmedRSVPs.length;

                            // Concatenate with the delimiter "-"
                            string memory result = string(abi.encodePacked(
                                myEvent.title,
                                "-",
                                myEvent.phone,
                                "-",
                                uintToString(attended),
                                "-",
                                uintToString(myEvent.maxCapacity)
                            ));

                            data = appendToArray(data, result);
                        }
                    }
                }
            }
            
        }
        emit Phones(data);
       
    }


    function confirmAttendee(uint256 eventId, address attendee) public {
        // look up event from our struct using the eventId
        CreateEvent storage myEvent = idToEvent[eventId];

        address rsvpConfirm;

        for (uint8 i = 0; i < myEvent.confirmedRSVPs.length; i++) {
            if (myEvent.confirmedRSVPs[i] == attendee) {
                rsvpConfirm = myEvent.confirmedRSVPs[i];
            }
        }

        require(rsvpConfirm == attendee, "NO RSVP TO CONFIRM");

        // add the attendee to the claimedRSVPs list
        myEvent.claimedRSVPs.push(attendee);

        // sending eth back to the staker `https://solidity-by-example.org/sending-ether`
        (bool sent, ) = attendee.call{value: myEvent.deposit}("");

        // if this fails, remove the user from the array of claimed RSVPs
        if (!sent) {
            myEvent.claimedRSVPs.pop();
        }

        require(sent, "Failed to send Ether");
        myEvent.paidOut = true;
        emit ConfirmedAttendee(eventId, attendee);
    }

    function withdrawUnclaimedDeposits(uint256 eventId) external {
        // look up event
        CreateEvent memory myEvent = idToEvent[eventId];

        // check that the paidOut boolean still equals false AKA the money hasn't already been paid out
        require(!myEvent.paidOut, "ALREADY PAID");

        // check if it's been 2 minutes past myEvent.eventTimestamp
        require(
            block.timestamp >= (myEvent.eventTimestamp + 2 minutes),
            "TOO EARLY"
        );

        // only the event owner can withdraw
        require(msg.sender == myEvent.eventOwner, "MUST BE EVENT OWNER");

        // calculate how many people didn't claim by comparing
        uint256 unclaimed = myEvent.confirmedRSVPs.length -
            myEvent.claimedRSVPs.length;

        uint256 payout = unclaimed * myEvent.deposit;

        // mark as paid before sending to avoid reentrancy attack
        myEvent.paidOut = true;

        // send the payout to the owner
        (bool sent, ) = msg.sender.call{value: payout}("");

        if (!sent) {
            myEvent.paidOut = false;
        }

        require(sent, "Failed to send Ether");
        emit DepositsPaidOut(eventId);
    }

    function getEventId(uint i) public view returns (uint256) {
        return eventIds[i];
    }

    function getEvent(uint256 eventID) public view returns (
        string memory title,
        string memory imagePath,
        address eventOwner,
        uint256 eventTimestamp,
        uint256 maxCapacity,
        uint256 deposit,
        address[] memory confirmedRSVPs
    ) {
        return (
        idToEvent[eventID].title,
        idToEvent[eventID].imagePath,
        idToEvent[eventID].eventOwner,
        idToEvent[eventID].eventTimestamp,
        idToEvent[eventID].maxCapacity,
        idToEvent[eventID].deposit,
        idToEvent[eventID].confirmedRSVPs
        );
    }

    // Returns array of indexes of events created by creator
    function getCreatorEvents(address creator) external view returns(uint256[] memory createdEvents) {
        return addressEventsList[creator];
    }


    function getUserRSVPs(address attendee) external view returns(uint256[] memory RSVPs) {
        return addressRSVPsList[attendee];
    }

    function getEventLength() public view returns (uint) {
        return eventIds.length;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Helper function to check if an element is in the array
    function contains(string[] memory arr, string memory element) internal pure returns (bool) {
        for (uint256 i = 0; i < arr.length; i++) {
            if (keccak256(bytes(arr[i])) == keccak256(bytes(element))) {
                return true;
            }
        }
        return false;
    }

    // Helper function to append a string to a string array
    function appendToArray(string[] memory arr, string memory element) internal pure returns (string[] memory) {
        string[] memory newArr = new string[](arr.length + 1);
        for (uint256 i = 0; i < arr.length; i++) {
            newArr[i] = arr[i];
        }
        newArr[arr.length] = element;
        return newArr;
    }

    // Function to convert uint256 to string
    function uintToString(uint256 v) internal pure returns (string memory) {
        if (v == 0) {
            return "0";
        }

        uint256 maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint256 i = 0;
        while (v != 0) {
            uint256 remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }

        bytes memory s = new bytes(i);
        for (uint256 j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1];
        }

        return string(s);
    }

     function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory  /* performData */)
    {
        for(uint256 i = 0; i < eventIds.length; i++){
            upkeepNeeded = idToEvent[i].paidOut == false;
        }
        // upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        // if ((block.timestamp - lastTimeStamp) > interval) {
        //     lastTimeStamp = block.timestamp;
        //     confirmAllAttendees()
        // }
       for(uint256 i = 0; i < eventIds.length; i++){
            if(block.timestamp <= idToEvent[i].eventTimestamp + 2 minutes
             && idToEvent[i].paidOut == false  && idToEvent[i].confirmedRSVPs.length != 0
               ){
                confirmAllAttendees();
            }

            if(block.timestamp <= idToEvent[i].eventTimestamp + 2 minutes 
            && idToEvent[i].paidOut == true  && idToEvent[i].confirmedRSVPs.length != 0){
                sendUnclaimedFeeToRandomConfirmedAttendee();
            }
        }

       
        // We don't use the performData in this example. The performData is generated by the Automation Node's call to your checkUpkeep function
    }


    function sendUnclaimedFeeToRandomConfirmedAttendee() public  returns (address){        
        CreateEvent memory myEvent;
         for(uint256 i = 0; i < eventIds.length; i++){
             // look up event
         myEvent = idToEvent[i];

        }
    // check that the paidOut boolean still equals false AKA the money hasn't already been paid out
        require(!myEvent.paidOut, "ALREADY PAID");
            // check if it's been 2 minutes past myEvent.eventTimestamp
        require(
            block.timestamp >= (myEvent.eventTimestamp + 2 minutes),
            "TOO EARLY"
        );

        // calculate how many people didn't claim by comparing
        uint256 unclaimed = myEvent.confirmedRSVPs.length -
            myEvent.claimedRSVPs.length;

        uint256 payout = unclaimed * myEvent.deposit;

        // mark as paid before sending to avoid reentrancy attack
        myEvent.paidOut = true;

        // implement the random person and send to the random person
        // send the payout to the owner
        uint256 eventId;
        requestRandomWords();

        for(uint256 i = 0; i < eventIds.length; i++){
             // look up event
             eventId = i;
         address [] memory confirmedList = idToEvent[i].confirmedRSVPs;
         uint256 winnerIndex = randomWordsNum % confirmedList.length;
          recentWinner = confirmedList[winnerIndex];

        }
        (bool sent, ) = recentWinner.call{value: payout}("");

        if (!sent) {
            myEvent.paidOut = false;
        }

        require(sent, "Failed to send Ether");
        emit DepositsPaidOut(eventId);
        return recentWinner;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords()
        public 
        onlyOwner
        returns (uint256 requestId)
    {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        randomWordsNum = _randomWords[0]; // Set array-index to variable, easier to play with

        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }
}

