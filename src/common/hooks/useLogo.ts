/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import companySettings from '$app/common/constants/company-settings';
import { useCompanyChanges } from './useCompanyChanges';
import { useCurrentCompany } from './useCurrentCompany';
import { useTranslation } from 'react-i18next';

function trimUrl(url) {
  if (!url) return null;

  // Remove 'public/index.php' from the URL if it exists
  const cleanedUrl = url.replace('/public/index.php', '');

  // Split the cleaned URL into parts
  const parts = cleanedUrl.split('/');

  // Reconstruct the URL with the desired parts
  return `${parts[0]}//${parts[2]}/${parts[3]}/${parts[4]}/${parts[5]}`;
}

export function useLogo() {
  const companyChanges = useCompanyChanges();
  const currentCompany = useCurrentCompany();

  // Trim the URLs
  const trimmedCompanyChangesLogo = trimUrl(companyChanges?.settings?.company_logo);
  const trimmedCurrentCompanyLogo = trimUrl(currentCompany?.settings?.company_logo);

  // console.log("Trimmed CompanyChanges Logo", trimmedCompanyChangesLogo);
  // console.log("Trimmed CurrentCompany Logo", trimmedCurrentCompanyLogo);

  // Return the trimmed logo URL or the default logo
  return (
    trimmedCompanyChangesLogo ||
    trimmedCurrentCompanyLogo ||
    companySettings.logo
  );
}

export function useCompanyName() {
  const currentCompany = useCurrentCompany();
  const [t] = useTranslation();

  return currentCompany?.settings?.name || t('untitled_company');
}
