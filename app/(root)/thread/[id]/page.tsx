import ThreadCard from "@/components/cards/ThreadCard";
import ThreadCommentForm from "@/components/forms/ThreadCommentForm";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Thread({ params }: { params: { id: string } }) {
  const currentLoggedInUser = await currentUser();
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser.id : ""
  );

  const thread = await fetchThreadById(params.id);

  if (!params.id || !currentLoggedInUser) return null;
  if (!currentLoggedInUserData.onboarded) redirect("/onboarding");

  const threadCardProps = {
    threadId: thread._id,
    currentUserId: currentLoggedInUser ? currentLoggedInUser?.id : null,
    parentId: thread.parentId ? thread.parentId : null,
    threadContent: thread.threadContent,
    threadAuthor: thread.threadAuthor,
    threadCommunity: thread.threadCommunity,
    createdAt: thread.createdAt,
    threadComments: thread.children,
  };

  const threadCommentFormProps = {
    threadId: JSON.stringify(thread._id),
    currentLoggedInUserImage: currentLoggedInUserData.image,
    userId: JSON.stringify(currentLoggedInUserData._id),
  };

  return (
    <section className="relative">
      <div>
        <ThreadCard {...threadCardProps} />;
      </div>
      <div className="mt-7">
        <ThreadCommentForm {...threadCommentFormProps} />
      </div>
      <div className="mt-10">
        {thread.children.map((commentThread: any) => {
          const commentThreadCardProps = {
            threadId: commentThread._id,
            currentUserId: currentLoggedInUser ? currentLoggedInUser?.id : null,
            parentId: commentThread.parentId ? commentThread.parentId : null,
            threadContent: commentThread.threadContent,
            threadAuthor: commentThread.threadAuthor,
            threadCommunity: commentThread.threadCommunity,
            createdAt: commentThread.createdAt,
            threadComments: commentThread.children,
          };

          return (
            <ThreadCard
              key={commentThread._id}
              {...commentThreadCardProps}
              isComment
            />
          );
        })}
      </div>
    </section>
  );
}
