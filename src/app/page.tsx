"use client"

import React from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { PiEyesFill } from "react-icons/pi";
import { FaLaptopCode } from "react-icons/fa";
import { IoIosColorPalette, IoLogoIonic } from "react-icons/io";
import { IoLibrary } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Loading from "@/components/Loading";
import Modetoggler from "@/components/Modetoggler";




export default function Home() {
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



  return (
    <div className="dark:bg-dark-mediumblack bg-light-white dark:text-light-white">

      {/* header section */}

      <section className="flex flex-col items-center py-10 px-10 gap-5 font-inter md:h-[60vh] lg:h-[70vh] lg:justify-center xl:h-[90vh]  xl:px-80 xl:gap-10">

        <div className="bg-conic/[from_var(--border-angle)] p-[.8px] rounded-full from-white dark:from-dark-black shadow-md via-light-black  dark:via-light-grey from-80% via-90% to-100% animate-rotate-border">
          <div className="content bg-light-mediumgrey dark:bg-dark-darkgrey md:text-xl py-2 px-4 rounded-full font-medium ">This is your UI partner</div>
        </div>

        <div className="text-3xl md:text-5xl text-center font-bold font-heading xl:text-6xl">A Generative UI Builder Powered By groq.</div>
        <div className="text-light-darkgrey md:text-2xl text-center text-lg ">This AI-powered Generative UI Builder transforms your ideas into designs and clean React and Tailwind code — no design skills required.</div>
        <div className="flex gap-3">
          <Link href={session ? "/Dashboard" : "/Login"}><button className="text-light-white bg-light-black px-5 py-3 rounded-md cursor-pointer hover:bg-light-black/90 hover:dark:bg-dark-white/90 dark:bg-dark-white dark:text-dark-black transition-all ease-in-out">Get Started</button></Link>
          <a href="https://github.com/Ajith7736/GenUI" target="_blank" rel="noopener noreferrer"><button className="text-light-black bg-light-white dark:bg-dark-black dark:text-dark-white  border dark:border-1 border-light-grey dark:border-dark-mediumgrey hover:bg-light-grey/20 hover:dark:bg-dark-mediumgrey transition-all ease-in-out cursor-pointer px-5 py-3 rounded-md">Github</button></a>
        </div>
      </section>

      {/* card section */}

      <section className="bg-light-mediumgrey/60 dark:bg-dark-mediumblack w-full min-h-[80vh] flex flex-col items-center py-5 px-10 gap-8 xl:px-30">
        <div className="text-3xl xl:text-4xl font-bold font-heading">Features</div>
        <div className="text-light-darkgrey text-center text-lg lg:w-[50vw] xl:text-xl">Build interfaces at the speed of thought. GenUI, powered by Groq AI, transforms your text descriptions into UIs — instantly. Experience fast, intelligent UI generation built for developers and designers alike.</div>
        <div className="flex flex-col gap-5 md:flex-row md:flex-wrap md:justify-center">
          {featurecard.map((item, index) => {
            return (<div key={index} className="bg-light-white  dark:bg-dark-mediumblack dark:border-dark-mediumgrey w-full md:w-[40vw] lg:w-[30vw] min-h-[25vh] rounded-xl border border-light-grey p-10 flex flex-col gap-5 justify-center">
              <div className="text-2xl font-bold xl:text-3xl">{item.logo}</div>
              <div className="text-lg font-medium xl:text-xl">{item.title}</div>
              <div className="font-medium text-light-darkgrey">{item.description}</div>
            </div>)
          })}
        </div>
        <div className="text-center text-light-darkgrey lg:w-[50vw] xl:text-xl">With Groq AI at its core, GenUI delivers blazing-fast generations and accurate component rendering — helping teams prototype, iterate, and build beautiful interfaces in record time.</div>
      </section>

      {/* footer section  */}

      <section className="p-10 flex relative flex-col items-center gap-5 select-none">
        <div className="text-center text-3xl xl:text-4xl font-bold">Proudly Open Source</div>
        <div className="text-center text-light-darkgrey xl:text-lg xl:w-[40vw]">GenUI is open source and powered by open source software.
          The code is available on <a href="https://github.com/Ajith7736/GenUI" target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>.
        </div>
        <IoLogoIonic size={30} />
        <div className="md:flex items-center md:justify-between">
          <div className="text-center mt-20 xl:text-lg xl:w-[40vw]">Built by <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="underline">Next.js</a>
            , Hosted on <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="underline">vercel</a>
            , Inspired by <a href="https://tx.shadcn.com/" target="_blank" rel="noopener noreferrer" className="underline">Taxonomy</a>
            .The source code is available on <a href="https://github.com/Ajith7736/GenUI" className="underline" target="_blank" rel="noopener noreferrer"> GitHub</a> </div>
          <Modetoggler />
        </div>
      </section>
    </div>
  );
}
