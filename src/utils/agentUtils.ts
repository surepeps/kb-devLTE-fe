export interface Agent {
  id: string;
  accountStatus: string;
  isInActive: boolean;
  isFlagged: boolean;
  // ...other properties...
}

export function calculateAgentCounts(agents: Agent[]) {
  return {
    total: agents.length,
    active: agents.filter((agent) => agent.accountStatus.toLowerCase() === 'active').length,
    inactive: agents.filter((agent) => agent.accountStatus.toLowerCase() === 'inactive').length,
    banned: agents.filter((agent) => agent.isInActive).length,
    flagged: agents.filter((agent) => agent.isFlagged).length,
     // Assuming banned agents are marked as inactive
  };
}
