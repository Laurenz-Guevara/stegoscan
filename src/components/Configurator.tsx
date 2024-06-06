"use client";
import Image from "next/image";

export interface Image {
  id: number;
  name: string;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export default function Configurator({ images }: { images: Image[] }) {
  return (
    <div className="flex flex-1 flex-col h-full bg-zinc-100 rounded-xl mt-2 p-4">
      <p>Database Controls</p>
      {images &&
        images.map((item: Image) => (
          <div key={item.id}>
            {item.name}
            <div className="w-20 h-20 relative">
              <Image fill src={item.url} alt={item.name} />
            </div>
          </div>
        ))}
    </div>
  );
}
