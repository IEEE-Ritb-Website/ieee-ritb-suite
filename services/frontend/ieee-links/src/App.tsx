import { ProfileSection } from "./components/profile";
import { Backgrounds } from "./components/backgrounds";
import { SocialLinks } from "./components/social-links";

function App() {
  return (
    <div className="min-h-screen w-full relative bg-black flex items-center justify-center overflow-hidden">
      <Backgrounds />
      <div className="flex items-center flex-col justify-center max-w-2xl w-full z-10 px-6 py-12">
        <ProfileSection className="mb-4" />

        <SocialLinks />

        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm font-light">
            Made with <span className="text-red-400 text-lg animate-pulse">♥</span> by IEEE RITB
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
