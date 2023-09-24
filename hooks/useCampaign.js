import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { deleteItem, save } from '../helper/store';

/**
 * @typedef useCampaign
 * @property {Campaign} campaign
 * @property {function()} setCampaign
 * @property {boolean} isLoading
 * @property {boolean} isUpdating
 * @property {function()} login
 * @property {function()} logout
 * @property {function()} refetchCampaign
 * @property {function()} updateCampaign
 */

/**
 * @param {Context<{campaign: Campaign|null, setCampaign: function()}>} CampaignContext
 */
const CampaignContext = createContext({
  campaign: null,
});

/**
 * useCampaign
 * @returns {useCampaign}
 */
export const useCampaign = () => useContext(CampaignContext);

/**
 * @param {object} props
 * @param {React.ReactElement} props.children
 * @returns {React.ProviderProps<{campaign: Campaign}>}
 */
export function CampaignProvider({ children }) {
  const [currentCampaign, setCurrentCampaign] = useState(null);

  const saveCampaign = useCallback(async () => {
    // update storage everytime campaign is updated
    if (currentCampaign) {
      await save('campaign', currentCampaign);
    }
    return true;
  }, [currentCampaign]);

  useEffect(() => {
    saveCampaign();
  }, [saveCampaign]);

  /**
   * Function to update campaign
   * @param {Campaign} campaign
   */
  const setCampaign = useCallback((campaign) => {
    setCurrentCampaign(campaign);
  }, []);

  const updateCampaign = useCallback(async (campaignData) => {
    const campaign = {
      ...currentCampaign,
      ...campaignData,
    };
    setCampaign(campaign);
  }, [currentCampaign, setCampaign]);

  /**
   * Function to remove campaign
   * @param {Campaign} campaign
   */
  const removeCampaign = useCallback(async () => {
    await deleteItem('campaign');
    setCurrentCampaign(null);
  }, []);

  const value = useMemo(() => ({
    campaign: currentCampaign,
    setCampaign,
    updateCampaign,
    removeCampaign,
  }), [currentCampaign, setCampaign, updateCampaign, removeCampaign]);

  return (
    <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>
  );
}
