"use client"
import React, { useEffect, useRef, useState } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { PiEyesFill } from "react-icons/pi";
import { FaLaptopCode } from "react-icons/fa";
import { IoIosColorPalette, IoLogoIonic } from "react-icons/io";
import { IoLibrary } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Loading from "@/components/Loading";
import Modetoggler from "@/components/Modetoggler";




export default function Home() {
  const [showtoggle, setshowtoggle] = useState<boolean>(false)
  const moderef = useRef<HTMLDivElement>(null)
  const { data: session, status }: {
    data: Session | null, status: string
  } = useSession()

  interface Card {
    logo: React.ReactElement,
    title: string,
    description: string
  }



  if (status === "loading") return <div className="fixed z-50 top-0">
    <Loading />
  </div>;

  const featurecard: Card[] = [
    {
      logo: <BsLightningChargeFill size={35} />,
      title: "Text to UI",
      description: "Describe your idea and generate UI instantly.",
    },
    {
      logo: <PiEyesFill size={35} />,
      title: "Live Preview",
      description: "See your UI before exporting the code.",
    },
    {
      logo: <FaLaptopCode size={35} />,
      title: "Code Export",
      description: "Copy or download clean React + Tailwind code.",
    },
    {
      logo: <IoIosColorPalette size={35} />,
      title: "Customizable Components",
      description: "Edit styles, colors, and layouts with ease.",
    },
    {
      logo: <IoLibrary size={34} />,
      title: "Templates Library",
      description: "Start quickly with dashboards, forms, and more.",
    },
    {
      logo: <FaHandshakeSimple size={35} />,
      title: "Collaboration",
      description: "Share your generated UI/code with teammates.",
    }
  ]

  const showToggle = (): void => {
    setshowtoggle(!showtoggle);
  }


  return (
    <div className="dark:bg-dark-black bg-light-white dark:text-light-white">

      {/* header section */}
      <section className="flex flex-col items-center py-10 px-10 gap-5 font-inter md:h-[60vh] lg:h-[70vh] lg:justify-center xl:h-[90vh]  xl:px-80 xl:gap-10">
        <div className="bg-light-mediumgrey md:text-xl py-2 px-4 rounded-full font-medium animate-pulse">This is your UI partner</div>
        <div className="text-3xl md:text-5xl text-center font-bold font-heading xl:text-6xl">A Generative UI Builder Powered By groq.</div>
        <div className="text-light-darkgrey md:text-2xl text-center text-lg ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, libero sint necessitatibus architecto nulla officia earum vero magni? Ad, debitis.</div>
        <div className="flex gap-3">
          <Link href={session ? "/Dashboard" : "/Login"}><button className="text-light-white bg-light-black px-5 py-3 rounded-md cursor-pointer hover:bg-light-black/90 transition-all ease-in-out">Get Started</button></Link>
          <a href="https://github.com/Ajith7736/GenUI" target="_blank" rel="noopener noreferrer"><button className="text-light-black bg-light-white border border-light-grey hover:bg-light-grey/20 transition-all ease-in-out cursor-pointer px-5 py-3 rounded-md">Github</button></a>
        </div>
      </section>

      {/* card section */}
      <section className="bg-light-mediumgrey/60 w-full min-h-[80vh] flex flex-col items-center py-5 px-10 gap-8 xl:px-30">
        <div className="text-3xl xl:text-4xl font-bold font-heading">Features</div>
        <div className="text-light-darkgrey text-center text-lg lg:w-[50vw] xl:text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, libero sint necessitatibus architecto nulla officia earum vero magni? Ad, debitis.</div>
        <div className="flex flex-col gap-5 md:flex-row md:flex-wrap md:justify-center">
          {featurecard.map((item, index) => {
            return (<div key={index} className="bg-light-white w-full md:w-[40vw] lg:w-[30vw] min-h-[25vh] rounded-xl border border-light-grey p-10 flex flex-col gap-5 justify-center">
              <div className="text-2xl font-bold xl:text-3xl">{item.logo}</div>
              <div className="text-lg font-medium xl:text-xl">{item.title}</div>
              <div className="font-medium text-light-darkgrey">{item.description}</div>
            </div>)
          })}
        </div>
        <div className="text-center text-light-darkgrey lg:w-[50vw] xl:text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor inventore nobis eos minima ipsam dicta corrupti ratione incidunt quo omnis?</div>
      </section>


      {/* footer section  */}
      <section className="p-10 flex relative flex-col items-center gap-5 select-none">
        <div className="text-center text-3xl xl:text-4xl font-bold">Proudly Open Source</div>
        <div className="text-center text-light-darkgrey xl:text-lg xl:w-[40vw]">GenUI is open source and powered by open source software.
          The code is available on
          <a href="https://github.com/Ajith7736/GenUI" target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>.
        </div>
        <div className="text-center mt-20 xl:text-lg xl:w-[40vw]">Built by <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="underline">Next.js</a>
          , Hosted on <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="underline">vercel</a>
          , Inspired by <a href="https://tx.shadcn.com/" target="_blank" rel="noopener noreferrer" className="underline">Taxonomy</a>
          .The source code is available on <a href="https://github.com/Ajith7736/GenUI" className="underline" target="_blank" rel="noopener noreferrer">GitHub</a> </div>
        <IoLogoIonic size={30} />
        <Modetoggler />
      </section>
    </div>
  );
}
