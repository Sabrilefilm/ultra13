
  // This is a targeted fix for just the fetchCreators function in CreatorDiamonds.tsx
  
  const fetchCreators = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('user_accounts')
        .select(`
          id,
          username,
          role,
          profiles(total_diamonds, diamonds_goal)
        `)
        .eq('role', 'creator');
        
      // Si l'utilisateur est un agent, ne montrer que ses créateurs
      if (role === 'agent') {
        query = query.eq('agent_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      const formattedCreators = data.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        total_diamonds: user.profiles?.[0]?.total_diamonds || 0,
        diamonds_goal: user.profiles?.[0]?.diamonds_goal || 0
      }));
      
      setCreators(formattedCreators);
      setFilteredCreators(formattedCreators);
    } catch (error) {
      console.error('Erreur lors du chargement des créateurs:', error);
      toast.error('Erreur lors du chargement des créateurs');
    } finally {
      setLoading(false);
    }
  };
