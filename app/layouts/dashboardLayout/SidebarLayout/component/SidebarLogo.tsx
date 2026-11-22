"use client";

import { observer } from "mobx-react-lite";
import styled, { keyframes } from "styled-components";
import { Avatar, useTheme } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import stores from "../../../../store/stores";
import { dashboard } from "../../../../config/utils/routes";
import { headerHeight } from "../../../../component/config/utils/variable";
import { WEBSITE_TITLE } from "../../../../config/utils/variables";
import { themeConfig } from "../../../../theme/themeConfig";

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

interface SidebarLogoProps {
  showBrand?: boolean;
  isDrawer?: boolean;
}

const SidebarLogo: React.FC<SidebarLogoProps> = observer(({ showBrand = false, isDrawer = false }) => {
  const router = useRouter();
  const {
    layout: { isCallapse },
    auth: { user },
  } = stores;
  const theme = useTheme();
  const brandScale = (theme.colors?.brand || {}) as Record<number, string>;
  const activeCompany = (stores.companyStore as any)?.companyDetails || (stores.companyStore as any)?.getActiveCompany?.();
  const companyName =
    user?.companyDetails?.company_name ||
    (typeof user?.company === "object" ? (user.company as any)?.company_name : null) ||
    activeCompany?.company_name ||
    WEBSITE_TITLE ||
    "Dashboard";

  const logoUrl =
    user?.companyDetails?.logo?.url ||
    (typeof user?.company === "object" ? (user.company as any)?.logo?.url : null) ||
    activeCompany?.logo?.url;

  const storedThemeColor =
    typeof window !== "undefined"
      ? localStorage.getItem("vendor_primary_theme_color") || localStorage.getItem("gym_primary_theme_color")
      : null;

  const userThemeColor =
    user?.companyDetails?.primaryThemeColor ||
    user?.companyOrg?.primaryThemeColor ||
    (typeof user?.company === "object" ? (user.company as any)?.primaryThemeColor : null) ||
    activeCompany?.primaryThemeColor ||
    storedThemeColor ||
    brandScale[500] ||
    themeConfig.colors.primary;

  const ringBackground = userThemeColor
    ? `linear-gradient(135deg, ${userThemeColor} 0%, rgba(255,255,255,0.2) 100%)`
    : `linear-gradient(135deg, ${brandScale[600] || "#065F68"} 0%, ${brandScale[400] || "#2A8A94"} 100%)`;

  const ringShadow = userThemeColor
    ? `0 0 0 2px ${userThemeColor}40, 0 4px 12px ${userThemeColor}4D`
    : `0 0 0 2px ${brandScale[500] || "#065F68"}40, 0 4px 12px ${brandScale[500] || "#065F68"}4D`;

  const ringHoverShadow = userThemeColor
    ? `0 0 0 3px ${userThemeColor}66, 0 10px 24px ${userThemeColor}80`
    : `0 0 0 3px ${brandScale[500] || "#065F68"}66, 0 10px 24px ${brandScale[500] || "#065F68"}80`;

  const accentLineBackground = userThemeColor
    ? `linear-gradient(90deg, transparent, ${userThemeColor}99 30%, ${userThemeColor}99 70%, transparent)`
    : `linear-gradient(90deg, transparent, ${brandScale[500] || "#065F68"}99 30%, ${brandScale[400] || "#2A8A94"}99 70%, transparent)`;

  const initials = (companyName || "BV")
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join("");

  const shouldShowBrand = !isCallapse || showBrand;

  return (
    <LogoWrapper
      $height={headerHeight}
      $isDrawer={isDrawer}
      onClick={() => {
        if (isDrawer) {
          stores.layout.setOpenMobileSideDrawer(false);
        }
        router.push(dashboard.home);
      }}
      role="button"
      aria-label="Go to home"
    >
      <AvatarRing
        $background={ringBackground}
        $boxShadow={ringShadow}
        $hoverBoxShadow={ringHoverShadow}
      >
        {logoUrl ? (
          <Avatar
            src={logoUrl}
            size="sm"
            borderRadius="10px"
            bg={brandScale[500] || "transparent"}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <Monogram>{initials}</Monogram>
        )}
      </AvatarRing>

      {shouldShowBrand && (
        <BrandText>
          <CompanyName>{companyName}</CompanyName>
          <TagLine>Dashboard</TagLine>
        </BrandText>
      )}

      <AccentLine $background={accentLineBackground} />
    </LogoWrapper>
  );
});

export default SidebarLogo;

const LogoWrapper = styled.div<{ $height: string; $isDrawer?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: ${({ $height }) => $height};
  padding: 0 18px;
  cursor: pointer;
  overflow: hidden;
  flex: ${({ $isDrawer }) => ($isDrawer ? "1" : "none")};
  flex-shrink: 0;

  background: ${({ $isDrawer }) =>
    $isDrawer
      ? "transparent"
      : `linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.25) 0%,
          rgba(0, 0, 0, 0.1) 100%
        )`};

  backdrop-filter: blur(6px);

  &:hover {
    background: ${({ $isDrawer }) => ($isDrawer ? "transparent" : "rgba(255, 255, 255, 0.06)")};
    transform: translateX(2px);
  }

  transition: all 0.2s ease;
`;

const AvatarRing = styled.div<{
  $background: string;
  $boxShadow: string;
  $hoverBoxShadow: string;
}>`
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $background }) => $background};
  box-shadow: ${({ $boxShadow }) => $boxShadow};
  transition: all 0.25s ease;

  ${LogoWrapper}:hover & {
    transform: scale(1.08);
    box-shadow: ${({ $hoverBoxShadow }) => $hoverBoxShadow};
  }
`;

const Monogram = styled.span`
  font-family: "Sora", "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--sidebar-active-text, #ffffff);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${fadeSlide} 0.25s ease both;
`;

const CompanyName = styled.h2`
  font-family: "Sora", "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--sidebar-active-text, #ffffff);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
`;

const TagLine = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: var(--sidebar-inactive-text, rgba(255, 255, 255, 0.7));
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AccentLine = styled.div<{ $background: string }>`
  position: absolute;
  bottom: 0;
  left: 18px;
  right: 18px;
  height: 1px;
  background: ${({ $background }) => $background};
`;
