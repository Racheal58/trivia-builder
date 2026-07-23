import {
  Trophy,
  Film,
  Gamepad2,
  BookOpen,
  FlaskConical,
  Globe,
  Music,
  Tv,
  Laugh,
  Palette,
  CircleHelp,
} from "lucide-react";

export function getCategoryIcon(category: string) {
  const name = category.toLowerCase();

  if (name.includes("sport")) {
    return Trophy;
  }

  if (name.includes("film") || name.includes("movie")) {
    return Film;
  }

  if (name.includes("anime")) {
    return Tv;
  }

  if (name.includes("video game")) {
    return Gamepad2;
  }

  if (name.includes("history")) {
    return BookOpen;
  }

  if (name.includes("science") || name.includes("nature")) {
    return FlaskConical;
  }

  if (name.includes("geography")) {
    return Globe;
  }

  if (name.includes("music")) {
    return Music;
  }

  if (name.includes("entertainment")) {
    return Laugh;
  }

  if (name.includes("art")) {
    return Palette;
  }

  return CircleHelp;
}
