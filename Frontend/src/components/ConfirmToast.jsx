import toast from "react-hot-toast";
export const confirmToast = (message) => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 items-center">
          <p className="text-sm font-semibold text-blue-600">{message}</p>

          <div className="flex gap-4 justify-center w-full">
            <div className="flex gap-3">
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={() => {
                resolve(true);
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>

            <button
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
              onClick={() => {
                resolve(false);
                toast.dismiss(t.id);
              }}
            >
              Cancel
            </button>
          </div>
          </div>
        </div>
      ),
      {
        duration: 10000, // stays long enough for decision
        position: "top-center",
      }
    );
  });
};