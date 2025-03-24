
import { useState } from 'react';
import { Creator } from './use-diamond-fetch';

export function useDiamondSearch(creators: Creator[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>(creators);
  const [activeTab, setActiveTab] = useState<string>('creators');

  // Update filtered creators when creators list changes
  useState(() => {
    setFilteredCreators(creators);
  }, [creators]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredCreators(creators);
    } else {
      let filtered;
      
      if (activeTab === 'creators') {
        filtered = creators.filter(creator => 
          creator.username.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCreators(filtered);
      }
    }
  };

  // Get active users based on selected tab
  const getActiveUsers = (managers: Creator[], agents: Creator[]) => {
    switch (activeTab) {
      case 'creators':
        return filteredCreators;
      case 'managers':
        return managers;
      case 'agents':
        return agents;
      default:
        return filteredCreators;
    }
  };

  return {
    searchQuery,
    filteredCreators,
    activeTab,
    setActiveTab,
    handleSearch,
    getActiveUsers
  };
}
