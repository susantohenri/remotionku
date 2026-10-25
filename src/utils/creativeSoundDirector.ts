import { staticFile } from 'remotion';
import * as RemotionSfx from '@remotion/sfx';
import { SceneData, SfxName } from '../types';

/**
 * Map berkas audio lokal berkecepatan tinggi di folder public/sfx/.
 * Menghindari latensi jaringan saat render video dan 100% reliable offline.
 */
const LOCAL_SFX_FILES: Partial<Record<Exclude<SfxName, 'auto' | 'none'>, string>> = {
  whip: 'sfx/whip.wav',
  whoosh: 'sfx/whoosh.wav',
  ding: 'sfx/ding.wav',
  mouseClick: 'sfx/mouse-click.wav',
  uiSwitch: 'sfx/switch.wav',
  shutterModern: 'sfx/shutter-modern.wav',
  vineBoom: 'sfx/vine-boom.wav',
  recordScratch: 'sfx/record-scratch.wav',
  bruh: 'sfx/bruh.wav',
  pageTurn: 'sfx/page-turn.wav',
};

/**
 * Mengambil path atau URL audio yang valid
 */
export function getSoundSource(name: Exclude<SfxName, 'auto' | 'none'>): string | null {
  const localRelative = LOCAL_SFX_FILES[name];
  if (localRelative) {
    return staticFile(localRelative);
  }
  // Fallback ke CDN resmi @remotion/sfx jika ada sound sekunder
  const remote = (RemotionSfx as Record<string, string>)[name];
  return remote ?? null;
}

export type ResolvedSfx = {
  src: string | null;
  volume: number;
  startFrameOffset: number;
  name?: string;
};

/**
 * Creative Sound Director:
 * Menentukan audio sound effect secara kontekstual, selektif, dan proporsional.
 * Mencegah video terasa bising atau seperti spam template dengan menerapkan
 * prinsip "less is more" (hanya aksen di momen emosional/punchline).
 */
export function resolveSceneSfx(
  scene: SceneData,
  sceneIndex: number,
  totalScenes: number
): ResolvedSfx {
  // 1. Jika eksplisit dinonaktifkan
  if (scene.sfx === 'none') {
    return { src: null, volume: 0, startFrameOffset: 0 };
  }

  // 2. Jika ditentukan secara manual di naskah / JSON
  if (scene.sfx && scene.sfx !== 'auto') {
    const soundSrc = getSoundSource(scene.sfx);
    if (soundSrc) {
      // Meme/Heavy SFX diset sedikit lebih halus agar tidak menenggelamkan narasi
      const isHeavy = ['vineBoom', 'dramaticBoomer', 'wilhelmScream', 'triggered'].includes(scene.sfx);
      const defaultVol = isHeavy ? 0.28 : 0.22;
      return {
        src: soundSrc,
        volume: scene.sfxVolume ?? defaultVol,
        startFrameOffset: 0,
        name: scene.sfx,
      };
    }
  }

  // 3. Mode 'auto' (Kreatif, Cerdas, dan Tidak Monoton)
  const isHook = sceneIndex === 0;
  const isLastCta = sceneIndex === totalScenes - 1;

  // A. Hook Scene (Scene 1) - Butuh audio snap agar scroll-stopping
  if (isHook) {
    return {
      src: getSoundSource('whip'), // Whip tajam dan cepat untuk visual pembuka
      volume: scene.sfxVolume ?? 0.22,
      startFrameOffset: 0,
      name: 'whip',
    };
  }

  // B. Scene Terakhir (CTA Card / Download) - Audio konfirmasi / kepuasan
  if (isLastCta) {
    return {
      src: getSoundSource('ding'), // Ding renyah untuk penutup ajakan download
      volume: scene.sfxVolume ?? 0.24,
      startFrameOffset: 2,
      name: 'ding',
    };
  }

  // C. Scene Tengah:
  // JANGAN bunyi di setiap scene! Cuma bunyi jika caption memiliki animasi berkarakter kuat
  const anim = scene.caption?.animation;
  const style = scene.caption?.style;

  if (anim === 'slam') {
    return {
      src: getSoundSource('whip'),
      volume: scene.sfxVolume ?? 0.2,
      startFrameOffset: 0,
      name: 'whip',
    };
  }

  if (anim === 'pop' || style === 'comic-pop') {
    return {
      src: getSoundSource('mouseClick'),
      volume: scene.sfxVolume ?? 0.18,
      startFrameOffset: 0,
      name: 'mouseClick',
    };
  }

  if (scene.transitionType === 'slide-left' && sceneIndex % 2 === 1) {
    return {
      src: getSoundSource('whoosh'),
      volume: scene.sfxVolume ?? 0.18,
      startFrameOffset: 0,
      name: 'whoosh',
    };
  }

  // Biarkan hening di scene lainnya agar vokal narator tetap jernih & nyaman didengar
  return { src: null, volume: 0, startFrameOffset: 0 };
}
