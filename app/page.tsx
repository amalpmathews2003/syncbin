import { Editor } from '@/components/editor';
import { ThemeSwitch } from '@/components/theme-switch';

export default function Home() {
  return (
    <div>
      <ThemeSwitch />
      <Editor />
    </div>
  );
}
