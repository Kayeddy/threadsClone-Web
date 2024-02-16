import ThreadCard from "@/components/cards/ThreadCard";
import { fetchProfileThreads } from "@/lib/actions/user.actions";

interface Props {
  currentLoggedInUserId: string;
  accessedAccountId: string;
  accessedAccountImage: string;
  accountThreads: any[];
  accountType: string;
  renderCardInteractions: boolean;
}

export default async function ThreadsTab({
  currentLoggedInUserId,
  accessedAccountImage,
  accessedAccountId,
  accountThreads,
  accountType,
  renderCardInteractions,
}: Props) {
  return (
    <section className="mt-9 flex flex-col gap-10">
      {accountThreads.length ? (
        accountThreads.map((thread: any) => {
          const threadCardProps = {
            threadId: thread._id,
            currentUserId: currentLoggedInUserId,
            parentId: thread.parentId ? thread.parentId : null,
            threadContent: thread.threadContent,
            threadAuthor: {
              name: thread.threadAuthor.name,
              image: accessedAccountImage,
              id: thread.threadAuthor._id.toString(),
            },
            threadCommunity: thread.threadCommunity,
            createdAt: thread.createdAt,
            threadComments: thread.children,
            isInCommunityPage: accountType === "Community" ? true : false,
            renderCardInteractions: renderCardInteractions,
          };

          return <ThreadCard key={thread._id} {...threadCardProps} />;
        })
      ) : (
        <p className="no-result">No threads available at this moment.</p>
      )}
    </section>
  );
}
