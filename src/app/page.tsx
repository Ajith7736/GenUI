"use client"

import { string } from "zod";

export default function Home() {
  interface Card {
    logo: string,
    title: string,
    description: string
  }

  const featurecard: Card[] = [
    {
      logo: "",
      title: "⚡ Text to UI",
      description: "Describe your idea and generate UI instantly.",
    },
    {
      logo: "",
      title: "👀 Live Preview",
      description: "See your UI before exporting the code.",
    },
    {
      logo: "",
      title: "💻 Code Export",
      description: "Copy or download clean React + Tailwind code.",
    },
    {
      logo: "",
      title: "🎨 Customizable Components",
      description: "Edit styles, colors, and layouts with ease.",
    },
    {
      logo: "",
      title: "📚 Templates Library",
      description: "Start quickly with dashboards, forms, and more.",
    },
    {
      logo: "",
      title: "🤝 Collaboration",
      description: "Share your generated UI/code with teammates.",
    }
  ]


  return (
    <div>
      <div className="flex flex-col items-center py-10 px-10 gap-5 font-inter md:h-[50vh] lg:h-[70vh] lg:justify-center xl:h-[90vh]  xl:px-80 xl:gap-10">
        {/* section 1 */}
        <div className="bg-light-mediumgrey md:text-xl py-2 px-4 rounded-full font-medium">This is your UI partner</div>
        <div className="text-3xl md:text-5xl text-center font-bold font-heading xl:text-6xl">An Generative UI Builder Powered By groq.</div>
        <div className="text-light-darkgrey md:text-2xl text-center text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, libero sint necessitatibus architecto nulla officia earum vero magni? Ad, debitis.</div>
        <div className="flex gap-3">
          <button className="text-light-white bg-light-black px-5 py-3 rounded-md cursor-pointer hover:bg-light-black/90 transition-all ease-in-out">Get Started</button>
          <button className="text-light-black bg-light-white border border-light-grey hover:bg-light-grey/20 transition-all ease-in-out cursor-pointer px-5 py-3 rounded-md">Github</button>
        </div>
      </div>
      {/* section 2 */}
      <div className="bg-light-mediumgrey/60 w-full min-h-[80vh] flex flex-col items-center py-5 px-10 gap-8">
        <div className="text-3xl font-bold font-heading">Features</div>
        <div className="text-light-darkgrey text-center text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, libero sint necessitatibus architecto nulla officia earum vero magni? Ad, debitis.</div>

        {featurecard.map((item, index) => {
          return <div className="bg-light-white w-full min-h-[25vh] rounded-xl border border-light-grey p-10 flex flex-col gap-5 justify-center">
            <div className="text-2xl font-bold">Logo</div>
            <div className="text-lg font-medium">{item.title}</div>
            <div className="font-medium text-light-darkgrey">{item.}</div>
          </div>
        })}

      </div>

    </div>
  );
}
