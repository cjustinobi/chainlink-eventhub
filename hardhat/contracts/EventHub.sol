//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract EventHub {
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


    function confirmAllAttendees() external {
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
}

