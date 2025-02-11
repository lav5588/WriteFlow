'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero:React.FC = () => (
  <section className="space-y-16 py-20">
    {/* Hero Section */}
    <div className="flex flex-col items-center justify-center text-center py-20 ">
      <h1 className="text-4xl font-extrabold tracking-tight">
        Welcome to Write Flow
      </h1>
      <p className="mt-4 text-lg">
        Share your thoughts and ideas with the world.
      </p>
      <Button className="px-6 py-3 mt-6 rounded">
        <Link href="/blogs">Get Started</Link>
      </Button>
    </div>

    {/* Read Blogs Section */}
    <div className="flex flex-col md:flex-row items-center  px-10 py-10">
      {/* Placeholder for image/Color */}
      <div className="w-full md:w-1/2">
        <Image src={'/HeroSvgs/read.svg'} width={500} alt={"Create"} height={300}></Image>
      </div>
      {/* Content */}
      <div className="w-full md:w-1/2 text-left p-6">
        <h2 className="text-3xl font-bold">Explore Inspiring Thoughts</h2>
        <p className="mt-4 text-base">
          Discover blogs from creative minds around the world. Whether you're
          looking for inspiration, entertainment, or knowledge, you'll find it
          here.
        </p>
        <Button className="px-6 py-3 mt-6 rounded">
          <Link href="/blogs">Read Blogs</Link>
        </Button>
      </div>
    </div>

    {/* Write Blogs Section */}
    <div className="flex flex-col md:flex-row-reverse items-center px-10 py-10">
      {/* Placeholder for Image/Color */}
      <div className="w-full md:w-1/2 ">
        <Image src={'/HeroSvgs/write.png'} width={500} alt={"Create"} height={300}></Image>
      </div>
      {/* Content */}
      <div className="w-full md:w-1/2 text-left p-6">
        <h2 className="text-3xl font-bold">Share Your Voice</h2>
        <p className="mt-4 text-base">
          Have a story to tell? Share your thoughts and connect with a global
          audience by writing your own blog.
        </p>
        <Button className="px-6 py-3 mt-6 rounded">
          <Link href="/create-blog">Write a Blog</Link>
        </Button>
      </div>
    </div>

    {/* About Us Section */}
    <div className="flex flex-col md:flex-row gap-8 items-centerpx-10 py-10">
      {/* Placeholder for Image/Color */}
      <div className="w-full md:w-1/2">
        <Image src={'/HeroSvgs/about.png'} width={500} alt={"Create"} height={300}></Image>
      </div>
      {/* Content */}
      <div className="w-full md:w-1/2 text-left p-6">
        <h2 className="text-3xl font-bold">About Us</h2>
        <p className="mt-4 text-base">
          Write Flow is a platform built to inspire creativity and enable
          writers to express themselves freely. Our mission is to connect
          people through the power of words and ideas.
        </p>
        <Button className="px-6 py-3 mt-6 rounded">
          <Link href="/">Learn More</Link>
        </Button>
      </div>
    </div>

    {/* Contact Us Section */}
    <div className="flex flex-col md:flex-row-reverse items-center  px-10 py-10">
      {/* Placeholder for Image/Color */}
      <div className="w-full md:w-1/2 ">
        <Image src={'/HeroSvgs/contact.png'} width={500} alt={"Create"} height={300}></Image>
      </div>
      {/* Content */}
      <div className="w-full md:w-1/2 text-left p-6">
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <p className="mt-4 text-base">
          Have questions or need support? Feel free to reach out to us. We’re
          here to help you on your journey to share your voice with the world.
        </p>
        <Button className="px-6 py-3 mt-6 rounded">
          <Link href="/">Get in Touch</Link>
        </Button>
      </div>
    </div>

    {/* Community Section */}
    <div className="flex flex-col md:flex-row items-center  px-10 py-10">
      {/* Placeholder for Image/Color */}
      <div className="w-full md:w-1/2 ">
        <Image src={'/HeroSvgs/join.png'} width={500} alt={"Create"} height={300}></Image>
      </div>
      {/* Content */}
      <div className="w-full md:w-1/2 text-left p-6">
        <h2 className="text-3xl font-bold">Join Our Community</h2>
        <p className="mt-4 text-base">
          Become a part of a growing community of thinkers, writers, and
          readers. Engage, comment, and collaborate with others who share your
          passion for ideas.
        </p>
        <Button className="px-6 py-3 mt-6 rounded">
          <Link href="/">Join Now</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default Hero;
