import AuthBackgroundWrapper from "../components/ui/AuthBackgroundWrapper";

export default function Layout({ children }) {
  return (
    <>
      <AuthBackgroundWrapper>{children}</AuthBackgroundWrapper>
    </>
  );
}
