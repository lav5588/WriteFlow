'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Drafts from '@/components/userTabs/drafts';
import Published from '@/components/userTabs/Published';
import { useSession } from 'next-auth/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { UpdateProfile } from '@/components/user-profile-features/update-profile';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { fetchDraftData, fetchPublishedData, fetchUserDataByUserName } from '@/network-call/userProfile.networkCall';
import { Loader2 } from 'lucide-react';
import { ISessionUser, IUser } from '@/types/user';
import { IBlog } from '@/types/blog';

interface ISession {
  data: {
    expires: string;
    user: ISessionUser;
  } | null;
  status: string;
}

const Page: React.FC = () => {

  const [user, setUser] = useState<IUser | null>(null);
  const params = useParams<{ username: string }>();
  const session: ISession = useSession();
  const [draftData, setDraftData] = useState<IBlog[]>([]);
  const [publishedData, setPublishedData] = useState<IBlog[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [isDraftAndPublishedDataLoading, setIsDraftAndPublishedDataLoading] = useState<boolean>(true);


  const fetchUserData = async () => {
    const userData = await fetchUserDataByUserName(params.username)
    setUser(userData);
    setIsProfileLoading(false);
  }


  // this is for draft and publish tabs
  async function fetchPublishedAndUnpublishedData() {
    const pubData = await fetchPublishedData(params.username);
    console.log("pubData: ", pubData);
    setPublishedData(pubData || []);
    if (session?.data?.user?.username === params.username) {
      const drData = await fetchDraftData();
      console.log("drData: ", drData);
      setDraftData(drData || []);
    }
    setIsDraftAndPublishedDataLoading(false);
  }

  useEffect(() => {
    fetchUserData();
    fetchPublishedAndUnpublishedData();
  }, [session]);

  if (!user && !isProfileLoading) {
    return <div>{params.username} not found</div>
  }


  return (
    <>

      <div className='flex justify-center items-center flex-col'>
        <Card className='mb-5 md:max-w-[50%] min-w-[20rem] md:min-w-[30rem] min-h-[25rem]'>
          {isProfileLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          ) : (
            <>
              {user && <>
                <CardHeader className='flex justify-center items-center'>
                  <CardTitle>User Profile</CardTitle>
                  <div className="relative h-[5rem] w-[5rem] ml-5">
                    {user?.profileImage === "" ? (
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src={user.profileImage} alt={user.username} />
                        <AvatarFallback>{user.username[0].toLocaleUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Dialog>
                        <DialogTrigger>
                          <Avatar className="h-full w-full">
                            <AvatarImage
                              src={user.profileImage} alt={user.username} />
                            <AvatarFallback>{user?.username[0].toLocaleUpperCase()}</AvatarFallback>
                          </Avatar>
                        </DialogTrigger>
                        <DialogContent>
                          <img src={user.profileImage} alt="userImage" className='pt-2' />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div>Name: {user.name}</div>
                  <div>Username: {user.username}</div>
                  <div>Email: {user.email}</div>
                  <div>Role: {user.role}</div>
                  <div>Verified: {user.isVerified ? 'true' : 'false'}</div>
                  <div>Bio: {user.bio}</div>
                </CardContent>
                <CardFooter>
                  {session?.data?.user?.username === user?.username && <UpdateProfile user={user} fetchUserData={fetchUserData} />}
                </CardFooter>
              </>}
            </>
          )}
        </Card>


        {/* Tabs */}

        <div className='flex justify-center w-full'>
          <div className="w-full max-w-6xl">
            <Tabs defaultValue="published" className="">
              <TabsList>
                <TabsTrigger value="published">Published</TabsTrigger>
                {session?.data?.user?.username == user?.username && <TabsTrigger value="draft">Drafts</TabsTrigger>}
              </TabsList>

              <TabsContent value="draft">
                {isDraftAndPublishedDataLoading ? <div className="flex justify-center items-center">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div> : <Drafts
                  draftData={draftData}
                  fetchPublishedAndUnpublishedData={fetchPublishedAndUnpublishedData}
                />}

              </TabsContent>
              <TabsContent value="published">
                {isDraftAndPublishedDataLoading ? <div className="flex justify-center items-center">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div> : <Published username={params.username}
                  publishedData={publishedData}
                  fetchPublishedAndUnpublishedData={fetchPublishedAndUnpublishedData}
                />}
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>

    </>
  );
}

export default Page;
