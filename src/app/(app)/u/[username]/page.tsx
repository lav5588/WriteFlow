'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Drafts from '@/components/userTabs/drafts';
import Published from '@/components/userTabs/Published';
import { ChangePassword } from '@/components/user-profile-features/changePassword';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { CameraIcon, PencilIcon } from 'lucide-react';
import { UpdateProfile } from '@/components/user-profile-features/update-profile';


const Page = () => {
  // Define the state type
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const params = useParams();
  const session = useSession();

  const fetchSession = async () => {
    try {
      const response = await axios.get(`/api/u/${params.username}`);
      if (!response) {
        console.log("No user found with this username");
        toast({
          variant: "destructive",
          title: "No user found with this username",
        })
        return;
      }
      console.log(response);
      setUser(response.data);
    } catch (error) {
      console.log("Error in fetching user data: ", error);
      toast({
        variant: "destructive",
        title: "Error fetching user data",
        description: error?.message,
      })

    }
  };

  useEffect(() => {
    
    fetchSession();
  }, []);

  if (!user) {
    return <div>Loading..</div>;
  }

  if (user.message) {
    return <div>{user.message}</div>;  // Display error message if any
  }
  else if (!user.username) {
    return <div>Internal Server Error</div>
  }


  return (
    <>

      <div className='flex justify-center items-center flex-col'>
        <Card className='mb-5'>
          <CardHeader className='flex jutify-center items-center'>
            <CardTitle>User Profile</CardTitle>
            <div className="relative h-[5rem] w-[5rem] ml-5">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user.profileImage} alt={user.username}/>
                <AvatarFallback >{user.username[0].toLocaleUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </CardHeader>
          <CardContent>
            <div>username: {user.username}</div>
            <div>email: {user.email}</div>
            <div>role: {user.role}</div>
            <div>verified: {user.isVerified ? 'true' : 'false'}</div>
          </CardContent>
          <CardFooter>
            {session?.data?.user?.username == user?.username && <UpdateProfile user={user} fetchSession={fetchSession}/>}
          </CardFooter>
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
                <Drafts />
              </TabsContent>
              <TabsContent value="published">
                <Published username={params.username} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>

    </>
  );
}

export default Page;
