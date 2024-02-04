import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import Loader from "@/components/shared/Loader";
import Searchbar from "@/components/shared/Searchbar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchAllUsers, fetchUserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const currentLoggedInUser = await currentUser();
  const currentLoggedInUserData = await fetchUserData(
    currentLoggedInUser ? currentLoggedInUser?.id : ""
  );

  let fetchedUsers: any = null;
  let fetchedCommunities: any = null;
  console.log(searchParams);

  if (!currentLoggedInUser) return null;

  if (!currentLoggedInUserData?.onboarded) {
    redirect("/onboarding");
  }

  // Fetch data from database depending on the URL parameters
  if (searchParams.author || searchParams.author === "") {
    fetchedUsers = await fetchAllUsers({
      userId: currentLoggedInUserData._id,
      searchString: searchParams.author,
      pageNumber: searchParams?.page ? +searchParams.page : 1,
      pageSize: 25,
    });
    console.log("fetchedUsers: ", fetchedUsers);
  }

  if (searchParams.community || searchParams.community === "") {
    fetchedCommunities = await fetchCommunities({
      searchString: searchParams.q,
      pageNumber: searchParams?.page ? +searchParams.page : 1,
      pageSize: 25,
    });
  }

  const renderUsers = () => {
    if (fetchedUsers && fetchedUsers.retrievedUsers.length === 0) {
      return <p className="no-result">No users were found</p>;
    }

    return fetchedUsers.retrievedUsers.map((user: any) => (
      <UserCard
        key={user.id}
        userId={JSON.stringify(user._id)}
        name={user.name}
        username={user.username}
        userProfileImage={user.image}
        personType="User"
      />
    ));
  };

  const renderCommunities = () => {
    if (fetchedCommunities && fetchedCommunities.communities.length === 0) {
      return <p className="no-result">No communities were found</p>;
    }

    if (fetchedCommunities) {
      return fetchedCommunities.communities.map((community: any) => (
        <CommunityCard
          key={community.id}
          id={community._id}
          name={community.name}
          alias={community.alias}
          imgUrl={community.image}
          createdBy={community.createdBy}
          members={community.members}
        />
      ));
    }
  };

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <Searchbar />
      <div className="mt-14 flex flex-col gap-9">
        {!Object.values(searchParams).length && renderUsers()}

        {searchParams.loading && searchParams.loading === "true" && <Loader />}

        {(searchParams.author || searchParams.author === "") && renderUsers()}

        {(searchParams.community || searchParams.community === "") &&
          renderCommunities()}
      </div>
    </section>
  );
}
