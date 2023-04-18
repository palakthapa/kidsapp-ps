import React, { useState } from 'react';
import Layout from '../components/Layout'
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

export default function Whiteboard() {
  const [mode, setMode] = useState('line');
  const [options, setOptions] = useState({});
  const [DrawingBoard, setDrawingBoard] = useState(null);
  const handleModeChange = () => {}

  useEffect(() => {
    setDrawingBoard(dynamic(() => import("react-drawing-board"), { ssr: false }));
  }, [])

  return (
    <Layout title="Whiteboard">
      <div className='w-4/5 h-full mx-auto'>
        {DrawingBoard ?
          <DrawingBoard
            style={{ width: '100%', height: '100%' }}
            onChange={(data) => console.log(data)}
            mode={mode}
            options={options}
            onModeChange={handleModeChange}
          /> : <div>Loading...</div>
      }
      </div>
    </Layout>
  )
}
