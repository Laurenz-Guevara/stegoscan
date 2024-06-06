"use client";

import { getExampleTable } from "@/server/db/database";
import { useState } from "react";
import NextImage from "next/image";

import { Image } from "@/components/Configurator";

export default function Configurator() {
  const [images, setImages] = useState<Image[]>([]);

  async function getData() {
    const data = await getExampleTable();
    console.log(data);
    setImages(data);
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-zinc-100 rounded-xl mt-2 p-4">
      <p>Database Controls</p>
      <div>
        <button
          className="bg-green-400 rounded-md px-4 py-1"
          onClick={() => getData()}
        >
          Query
        </button>
        {images &&
          images.map((item: Image) => (
            <div key={item.id}>
              {item.name}
              <div className="w-20 h-20 relative">
                <NextImage fill src={item.url} alt={item.name} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
