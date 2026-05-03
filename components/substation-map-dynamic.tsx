"use client";

import dynamic from "next/dynamic";
import { useId } from "react";
import type { SubMapItem } from "./substation-map";

const Inner = dynamic(() => import("./substation-map").then((m) => m.SubstationMap), { ssr: false });

export function SubstationMapDynamic(props: { items: SubMapItem[] }) {
  const mapKey = useId();
  return <Inner key={mapKey} {...props} />;
}
