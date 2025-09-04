"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Props to allow parent control
interface EmojiUploaderProps {
  emoji: string;
  setEmoji: (val: string) => void;
  search: string;
  setSearch: (val: string) => void;
}

// Minimal emoji list (replace or expand as needed)
const emojis = ["😀", "😂", "🥰", "😎", "🔥", "💡", "🚀", "🎉", "🌟", "🐱"];

export const EmojiUploader: React.FC<EmojiUploaderProps> = ({
  emoji,
  setEmoji,
  search,
}) => {
  const filteredEmojis = emojis.filter((e) => e.includes(search));

  return (
    <Card className="bg-card/50 border-border/50 shadow-card">
      <CardHeader>
        <CardTitle>Emoji Favicon</CardTitle>
        <CardDescription>Search or paste an emoji to use</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        {/* Emoji Input */}
        <Input
          placeholder="Paste emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          maxLength={2}
          className="w-64 text-center"
        />

        {/* Emoji Grid */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {filteredEmojis.map((e) => (
            <Button key={e} size="sm" onClick={() => setEmoji(e)}>
              {e}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
