// //  components/dashboard/inbox/MessageActionsMenu.jsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { MoreVertical, Pencil, Trash2, Forward, Trash } from "lucide-react";
// import { toast } from "react-toastify";
// import {
//   useDeleteMessagesForMeMutation,
//   useDeleteMessageForEveryoneMutation,
// } from "@/redux/api/services/chatApi";

// export default function MessageActionsMenu({
//   message,
//   conversationId,
//   isSelf,
//   onEdit,
//   onForward,
// }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   const [deleteForMe] = useDeleteMessagesForMeMutation();
//   const [deleteForEveryone] = useDeleteMessageForEveryoneMutation();

//   useEffect(() => {
//     const handler = e => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const handleDeleteForMe = async () => {
//     setOpen(false);
//     try {
//       await deleteForMe({ message_ids: [message.id], conversationId }).unwrap();
//     } catch (err) {
//       toast.error(err?.data?.message ?? "Couldn't delete message.");
//     }
//   };

//   const handleDeleteForEveryone = async () => {
//     setOpen(false);
//     try {
//       await deleteForEveryone({
//         message_id: message.id,
//         conversationId,
//       }).unwrap();
//     } catch (err) {
//       toast.error(err?.data?.message ?? "Couldn't unsend message.");
//     }
//   };

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         onClick={() => setOpen(v => !v)}
//         className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
//       >
//         <MoreVertical size={14} />
//       </button>

//       {open && (
//         <div
//           className={`absolute top-8 ${isSelf ? "right-0" : "left-0"} w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30`}
//         >
//           <button
//             onClick={() => {
//               setOpen(false);
//               onForward();
//             }}
//             className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
//           >
//             <Forward size={13} />
//             Forward
//           </button>
//           {isSelf && message.text && (
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 onEdit();
//               }}
//               className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
//             >
//               <Pencil size={13} />
//               Edit
//             </button>
//           )}
//           <button
//             onClick={handleDeleteForMe}
//             className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
//           >
//             <Trash2 size={13} />
//             Delete for me
//           </button>
//           {isSelf && (
//             <button
//               onClick={handleDeleteForEveryone}
//               className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
//             >
//               <Trash size={13} />
//               Delete for everyone
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Forward,
  Trash,
  Reply,
  Pin,
  PinOff,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useDeleteMessagesForMeMutation,
  useDeleteMessageForEveryoneMutation,
} from "@/redux/api/services/chatApi";

export default function MessageActionsMenu({
  message,
  conversationId,
  isSelf,
  onEdit,
  onForward,
  onReply,
  onTogglePin,
  trigger,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const [deleteForMe] = useDeleteMessagesForMeMutation();
  const [deleteForEveryone] = useDeleteMessageForEveryoneMutation();

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDeleteForMe = async () => {
    setOpen(false);
    try {
      await deleteForMe({ message_ids: [message.id], conversationId }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't delete message.");
    }
  };

  const handleDeleteForEveryone = async () => {
    setOpen(false);
    try {
      await deleteForEveryone({
        message_id: message.id,
        conversationId,
      }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't unsend message.");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={e => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
      >
        {trigger ?? (
          <button className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
            <MoreVertical size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          className={`absolute top-8 ${isSelf ? "right-0" : "left-0"} w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50`}
        >
          <button
            onClick={() => {
              setOpen(false);
              onReply();
            }}
            className="md:hidden w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Reply size={13} />
            Reply
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onForward();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Forward size={13} />
            Forward
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onTogglePin();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {message.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
            {message.isPinned ? "Unpin" : "Pin"}
          </button>

          {isSelf && message.text && (
            <button
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Pencil size={13} />
              Edit
            </button>
          )}

          <div className="my-1 border-t border-gray-50" />

          <button
            onClick={handleDeleteForMe}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            Delete for me
          </button>
          {isSelf && (
            <button
              onClick={handleDeleteForEveryone}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash size={13} />
              Delete for everyone
            </button>
          )}
        </div>
      )}
    </div>
  );
}
