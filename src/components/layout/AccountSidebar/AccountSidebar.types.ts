export type AccountNavTab =
  | "profile"
  | "measurements"
  | "wishlist"
  | "notifications"
  | "support"
  | "settings";

export interface AccountSidebarProps {
  activeTab: AccountNavTab;
}
