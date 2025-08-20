import { useState } from "react";
import { Search, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search tools...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const popularSearches = ["favicon", "jwt", "font", "pwa", "color", "base64"];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-12 h-12 text-base bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-smooth"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Badge
            variant="outline"
            className="text-xs px-2 py-1 border-muted-foreground/20"
          >
            <Command className="w-3 h-3 mr-1" />K
          </Badge>
        </div>
      </div>

      {query === "" && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Popular:</span>
          {popularSearches.map((search) => (
            <Badge
              key={search}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth text-xs"
              onClick={() => handleSearch(search)}
            >
              {search}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
