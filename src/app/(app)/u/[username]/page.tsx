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



const Page = () => {
  // Define the state type
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const params = useParams();
  const session = useSession();
  
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`/api/u/${params.username}`);
        if(!response) {
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
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div>username: {user.username}</div>
            <div>email: {user.email}</div>
            <div>role: {user.role}</div>
            <div>verified: {user.isVerified ? 'true' : 'false'}</div>
          </CardContent>
          <CardFooter>
            {session?.data?.user?.username == user?.username && <ChangePassword/>}
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
                <Published username={params.username}/>
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>

    </>
  );
}

export default Page;
