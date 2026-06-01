"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 10,
      paddingBottom: 10,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2.2,
    activeCursor: "pointer",
    tooltip: "native",
    initial: [0.08, -0.08],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.03,
    minSpeed: 0.01,
  },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#0d0d1a";
  const fallbackHex = theme === "light" ? "#000000" : "#00ff9d";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  });
};

export type DynamicIconCloudProps = {
  iconSlugs: string[];
};

export function IconCloud({ iconSlugs }: DynamicIconCloudProps) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (iconSlugs.length === 0) {
      setData(null);
      return;
    }
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
  }, [iconSlugs]);

  const renderedIcons = useMemo(() => {
    if (!data) return null;
    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon as SimpleIcon, "dark")
    );
  }, [data]);

  if (iconSlugs.length === 0 || !renderedIcons) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mx-auto flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,157,0.04)_0%,transparent_70%)] pointer-events-none" />
      {/* @ts-ignore */}
      <Cloud {...cloudProps}>
        {renderedIcons}
      </Cloud>
    </div>
  );
}
