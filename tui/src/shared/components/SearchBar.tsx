import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void; // Callback function to handle the search query
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the form from submitting traditionally
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex space-x-2">
      <Input
        type="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
      />
      <Button variant="outline" className="rounded-full">
        Search
      </Button>
    </form>
  );
};
