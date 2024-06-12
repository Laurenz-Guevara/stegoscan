"use client";

export default function Configurator() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 pt-2">
        <div className="h-8 w-1/4 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-96 w-full bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
}
