import { useEffect } from 'react';
import { useState } from 'react';
import Icon from './icon';
import { faStop, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const SoundButton = ({ src }) => {
  const [playing, setPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    const audio = new Audio(src || '/sounds/apple.mp3');
    audio.onended = () => {
      setPlaying(false);
    }
    setCurrentAudio(audio);
    return () => {
      audio.pause();
    }
  }, [src])

  function handleClick() {
    if (!currentAudio) return;
    if (!playing) {
      currentAudio.currentTime = 0;
      currentAudio.play();
      setPlaying(true)
    } else {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setPlaying(false);
    }
  }

  return (
    <button
      className="box-border w-[35px] h-[35px] bg-white flex items-center justify-around font-bold shadow-md hover:bg-gray-200 rounded"
      onClick={handleClick}
    >
      {playing ?
        <Icon icon={faStop} className="w-[20px] h-[20px] text-center" /> :
        <Icon icon={faVolumeUp} className="w-[25px] h-[25px] text-center" />
      }

    </button>
  );
};

export default SoundButton;
