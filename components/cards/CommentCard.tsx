import Image from "next/image";
import Link from "next/link";
import ThreadInteractionSection from "../shared/ThreadInteractionSection";
import { formatDateString } from "@/lib/utils";

interface Props {
  commentAuthor: {
    id: string;
    name: string;
    image: string;
  };
  currentUserId: string;
  commentContent: string;
  commentThreadId: string;
  threadLikes: string[];
  createdAt?: string;
  isInThreadPage?: boolean;
}

export default function CommentCard({
  commentAuthor,
  commentContent,
  commentThreadId,
  currentUserId,
  threadLikes,
  createdAt,
  isInThreadPage = false,
}: Props) {
  return (
    <div
      className={`flex items-start justify-between p-6 bg-transparent hover:bg-[#000000a2] border-slate-300 border-[1px] transition-all duration-200 ease-in-out rounded-lg ${
        isInThreadPage ? "w-full" : "w-[95%]"
      } my-4 transition-all duration-200 ease-in-out`}
    >
      <div className="flex w-full flex-1 flex-row gap-4">
        <div className="flex flex-col items-center">
          <Link
            href={`${
              currentUserId === commentAuthor.id
                ? "/profile"
                : `/${commentAuthor.id}`
            }`}
            className="relative h-11 w-11"
          >
            <Image
              src={commentAuthor.image}
              alt="Thread_Author_Profile_Image"
              fill
              sizes="32x32"
              className="cursor-pointer rounded-full"
            />
          </Link>

          <div className="thread-card_bar" />
        </div>

        <div className="flex w-full flex-col items-start justify-center">
          <Link href={`/profile/${commentAuthor.id}`} className="w-fit">
            <h4 className="cursor-pointer text-base-semibold text-light-1">
              {currentUserId === commentAuthor.id ? "You" : commentAuthor.name}
            </h4>
          </Link>

          <p className="mt-2 text-small-regular text-light-2 whitespace-pre-line break-all text-left">
            {commentContent}
          </p>

          <div className="mt-5 flex flex-col gap-3 mb-4">
            <ThreadInteractionSection
              threadId={commentThreadId}
              threadAuthor={commentAuthor}
              currentUserId={currentUserId}
              threadLikes={threadLikes}
              isComment={true}
            />
          </div>

          <p className="text-subtle-medium text-gray-1 mt-3">
            {formatDateString(createdAt ? createdAt : "")}
          </p>
        </div>
      </div>
    </div>
  );
}
