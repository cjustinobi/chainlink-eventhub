import ReactDOM from "react-dom";

interface DeleteModalProps {
  onClose: () => void;
  onDelete: () => void;
  title: string;
  subtitle: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  subtitle,
  onClose,
  onDelete,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed w-full h-full inset-0 z-[70] flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 z-[80] bg-black bg-opacity-50 flex items-center justify-center text-white"
      ></div>
      <div className="w-[95%] lg:w-auto lg:h-auto bg-white p-1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] rounded-lg">
        <div className="p-3 lg:p-5 rounded-lg bg-[#fff] lg:w-[40vw] overflow-x-auto lg:max-h-[90vh] max-h-[90vh] no-scrollbar">
          <div className="flex justify-between pb-3 mb-5 border-b">
            <h2 className="text-2xl text-gray-950 font-bold">{title}</h2>
            <button
              className=" text-customGray hover:text-customGold"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 11.0102L11.6465 10.6567L6.49494 5.50511C6.49492 5.50509 6.4949 5.50507 6.49488 5.50506C6.36362 5.37386 6.18563 5.30016 6.00004 5.30016C5.81447 5.30016 5.6365 5.37384 5.50524 5.505C5.50521 5.50504 5.50517 5.50507 5.50514 5.50511M12 11.0102L5.50514 5.50511M12 11.0102L12.3536 10.6567L17.5052 5.50506L17.5052 5.50511L17.5113 5.49886C17.5759 5.432 17.6531 5.37867 17.7385 5.34199C17.8239 5.3053 17.9158 5.28599 18.0087 5.28518C18.1016 5.28438 18.1938 5.30209 18.2798 5.33728C18.3659 5.37248 18.444 5.42446 18.5098 5.49018C18.5755 5.55591 18.6275 5.63406 18.6627 5.72009C18.6979 5.80612 18.7156 5.8983 18.7148 5.99124C18.7139 6.08418 18.6946 6.17604 18.658 6.26144C18.6213 6.34684 18.5679 6.42408 18.5011 6.48866L18.501 6.4886L18.4949 6.49475L13.3433 11.6463L12.9897 11.9999L13.3433 12.3535L18.4914 17.5016C18.6173 17.6333 18.6868 17.809 18.6853 17.9912C18.6837 18.1748 18.6101 18.3503 18.4803 18.4801C18.3505 18.6099 18.1749 18.6835 17.9914 18.6851C17.8091 18.6867 17.6335 18.6171 17.5017 18.4913L12.3536 13.3431L12 12.9896L11.6465 13.3431L6.49836 18.4913C6.36663 18.6171 6.19098 18.6867 6.0087 18.6851C5.82516 18.6835 5.64959 18.6099 5.51981 18.4801C5.39002 18.3503 5.3164 18.1748 5.31481 17.9912C5.31322 17.809 5.38281 17.6333 5.50867 17.5016L10.6568 12.3535L11.0103 11.9999L10.6568 11.6463L5.50524 6.4948M12 11.0102L5.50524 6.4948M5.50514 5.50511C5.37397 5.63637 5.30029 5.81434 5.30029 5.9999C5.30029 6.18549 5.37399 6.36348 5.50519 6.49475M5.50514 5.50511L5.50519 6.49475M5.50519 6.49475C5.50521 6.49477 5.50523 6.49478 5.50524 6.4948M5.50519 6.49475L5.50524 6.4948"
                  fill="currentColor"
                  stroke="currentColor"
                />
              </svg>
            </button>
          </div>
          <p className="mb-5">{subtitle}</p>
          <div className="grid grid-flow-row grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="rounded-lg flex items-center justify-center hover:opacity-80 w-full font-bold py-3 px-6 text-customGold border border-customGold hover:bg-customGold hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg flex items-center justify-center hover:opacity-80 text-white w-full font-bold py-3 px-6 bg-customRed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal")!
  );
};

export default DeleteModal;
