import { useCallback, useMemo } from 'react';
import { useGlobalNegotiation, useNegotiation } from '@/context/negotiation-context';
import { toast } from 'react-hot-toast';

/**
 * Utility hook that provides enhanced negotiation functionality
 * Can be used from any component that has access to negotiation context
 */
export const useNegotiationUtils = () => {
  const globalContext = useGlobalNegotiation();
  
  // Try to get the full context if available
  let negotiationContext = null;
  try {
    negotiationContext = useNegotiation();
  } catch {
    // Context not available in this component tree
  }

  const isContextAvailable = globalContext.isAvailable;
  const isGloballyAccessible = globalContext.isGloballyAccessible;

  // Helper function to check counter limits and show appropriate messages
  const checkCounterLimits = useCallback((type: 'price' | 'loi') => {
    // Try global context first if available
    if (isGloballyAccessible && 'canMakeCounter' in globalContext && 'getRemainingCounters' in globalContext) {
      const canCounter = globalContext.canMakeCounter(type);
      const remaining = globalContext.getRemainingCounters(type);

      if (!canCounter) {
        const message = type === 'price'
          ? 'You have reached the maximum number of price negotiations for this property.'
          : `You have reached the maximum number of LOI request changes (${globalContext.counterLimits?.loiRequests || 0}). No more changes allowed.`;

        return { canCounter: false, message };
      }

      if (type === 'loi' && remaining !== null && remaining <= 1) {
        const message = remaining === 1
          ? 'This is your last LOI request change!'
          : 'You have used all your LOI request changes.';

        return { canCounter: true, message, isLastChance: remaining === 1 };
      }

      return { canCounter: true, message: '' };
    }

    // Fall back to negotiation context
    if (!negotiationContext) {
      return { canCounter: false, message: 'Negotiation context not available' };
    }

    const canCounter = negotiationContext.state.counterTracking.canCounter(type);
    const remaining = negotiationContext.state.counterTracking.getRemainingCounters(type);

    if (!canCounter) {
      const message = type === 'price'
        ? 'You have reached the maximum number of price negotiations for this property.'
        : `You have reached the maximum number of LOI request changes (${negotiationContext.state.counterLimits.loiRequests}). No more changes allowed.`;

      return { canCounter: false, message };
    }

    if (type === 'loi' && remaining !== null && remaining <= 1) {
      const message = remaining === 1
        ? 'This is your last LOI request change!'
        : 'You have used all your LOI request changes.';

      return { canCounter: true, message, isLastChance: remaining === 1 };
    }

    return { canCounter: true, message: '' };
  }, [negotiationContext, isGloballyAccessible, globalContext]);

  // Function to show counter limit warnings
  const showCounterLimitWarning = useCallback((type: 'price' | 'loi') => {
    const result = checkCounterLimits(type);
    
    if (!result.canCounter) {
      toast.error(result.message);
      return false;
    }

    if (result.message && result.isLastChance) {
      toast.warning(result.message);
    }

    return true;
  }, [checkCounterLimits]);

  // Function to initialize negotiation context from external data
  const initializeNegotiation = useCallback((data: any, userRole: 'seller' | 'buyer') => {
    if (!globalContext.initializeContext) {
      console.warn('Negotiation context initialization not available');
      return false;
    }

    try {
      globalContext.initializeContext(data, userRole);
      globalContext.makeGloballyAccessible?.();
      return true;
    } catch (error) {
      console.error('Failed to initialize negotiation context:', error);
      toast.error('Failed to initialize negotiation');
      return false;
    }
  }, [globalContext]);

  // Get counter statistics
  const getCounterStats = useCallback(() => {
    if (!negotiationContext || !isGloballyAccessible) {
      return null;
    }

    return {
      priceCounters: {
        used: negotiationContext.priceCounterCount,
        remaining: negotiationContext.getRemainingPriceCounters(),
        unlimited: negotiationContext.counterLimits.priceNegotiation === null,
      },
      loiCounters: {
        used: negotiationContext.loiCounterCount,
        remaining: negotiationContext.getRemainingLoiCounters(),
        limit: negotiationContext.counterLimits.loiRequests,
      },
    };
  }, [negotiationContext, isGloballyAccessible]);

  // Format counter display text
  const formatCounterDisplay = useCallback((type: 'price' | 'loi') => {
    const stats = getCounterStats();
    if (!stats) return '';

    if (type === 'price') {
      return stats.priceCounters.unlimited 
        ? `${stats.priceCounters.used} counters used (unlimited)`
        : `${stats.priceCounters.used} of ${stats.priceCounters.used + (stats.priceCounters.remaining || 0)} counters used`;
    } else {
      return `${stats.loiCounters.used} of ${stats.loiCounters.limit} changes used`;
    }
  }, [getCounterStats]);

  // Check if negotiation is active
  const isNegotiationActive = useMemo(() => {
    if (!negotiationContext || !isGloballyAccessible) return false;
    
    return negotiationContext.details?.negotiationStatus && 
           !['completed', 'cancelled', 'rejected'].includes(negotiationContext.details.negotiationStatus);
  }, [negotiationContext, isGloballyAccessible]);

  // Get current negotiation stage
  const getCurrentStage = useCallback(() => {
    if (!negotiationContext || !isGloballyAccessible) return null;
    
    return {
      stage: negotiationContext.details?.stage || 'unknown',
      status: negotiationContext.details?.negotiationStatus || 'unknown',
      pendingFrom: negotiationContext.details?.pendingResponseFrom || 'unknown',
      isLOI: negotiationContext.negotiationType === 'LOI',
    };
  }, [negotiationContext, isGloballyAccessible]);

  return {
    // Context availability
    isContextAvailable,
    isGloballyAccessible,
    
    // Initialization
    initializeNegotiation,
    
    // Counter management
    checkCounterLimits,
    showCounterLimitWarning,
    getCounterStats,
    formatCounterDisplay,
    
    // Negotiation state
    isNegotiationActive,
    getCurrentStage,
    
    // Direct access to context (when available)
    negotiationContext: isGloballyAccessible ? negotiationContext : null,
    
    // Utility functions
    canMakeCounterOffer: (type: 'price' | 'loi') => checkCounterLimits(type).canCounter,
    getRemainingCounters: (type: 'price' | 'loi') => {
      const stats = getCounterStats();
      return type === 'price' ? stats?.priceCounters.remaining : stats?.loiCounters.remaining;
    },
  };
};

export default useNegotiationUtils;
