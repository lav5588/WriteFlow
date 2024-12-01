'use client'
import { Session } from 'next-auth'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Drafts from '@/components/userTabs/drafts';



const Page = () => {
  // Define the state type
  const [user, setUser] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchSession = async () => {
      const response = await axios.get(`/api/u/${params.username}`);
      console.log(response);
      setUser(response.data);
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

        </Card>

        {/* Tabs */}

        <div className='flex justify-center w-full'>
          <div className="w-full max-w-6xl">
            <Tabs defaultValue="published" className="">
              <TabsList>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              <TabsContent value="draft">
                <Drafts />
              </TabsContent>
              <TabsContent value="published">Change your published content here.</TabsContent>
            </Tabs>
          </div>
        </div>

      </div>

    </>
  );
}

export default Page;
