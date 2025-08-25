import React, { useRef, useState, useEffect, useCallback } from 'react';

const Form_SignaturePad = ({ height = 280, onSave, disable }) => {
    const canvasRef = useRef(null);
    const [strokes, setStrokes] = useState([]);
    const [currentStroke, setCurrentStroke] = useState(null);
    const [penWidth, setPenWidth] = useState(2);
    const [penColor, setPenColor] = useState('#000000');

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * ratio;
        canvas.height = h * ratio;
        const ctx = canvas.getContext('2d');
        ctx.scale(ratio, ratio);
        redraw();
    }, [strokes, currentStroke]);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    const beginStroke = (x, y) => {
        setCurrentStroke({ color: penColor, width: penWidth, points: [{ x, y }] });
    };

    const pushPoint = (x, y) => {
        setCurrentStroke(prev => ({ ...prev, points: [...prev.points, { x, y }] }));
    };

    const endStroke = () => {
        if (currentStroke) {
            setStrokes(prev => [...prev, currentStroke]);
            setCurrentStroke(null);
        }
    };

    const redraw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        [...strokes, currentStroke].forEach(s => {
            if (!s) return;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.width;
            ctx.beginPath();
            s.points.forEach((p, i) => {
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        });
    };

    useEffect(() => {
        redraw();
    }, [strokes, currentStroke]);


    const [hasSignature, setHasSignature] = useState(false);
    const handlePointerDown = e => {
        const rect = canvasRef.current.getBoundingClientRect();
        beginStroke(e.clientX - rect.left, e.clientY - rect.top);
        setHasSignature(true);
    };

    const handlePointerMove = e => {
        if (!currentStroke) return;
        const rect = canvasRef.current.getBoundingClientRect();
        pushPoint(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handlePointerUp = () => {
        endStroke();
        if (hasSignature) {
            handleSave('image/png');
        }
    };

    const clearCanvas = () => {
        setStrokes([]);
        setCurrentStroke(null);
    };

    const undoLast = () => {
        setStrokes(prev => prev.slice(0, -1));
    };

    const getDataURL = (type = 'image/png') => {
        const canvas = canvasRef.current;
        return canvas.toDataURL(type);
    };

    const downloadImage = (type) => {
        const data = getDataURL(type);
        const link = document.createElement('a');
        link.href = data;
        link.download = `signature.${type === 'image/png' ? 'png' : 'jpg'}`;
        link.click();
    };

    const handleSave = (type = 'image/png') => {
        const dataUrl = getDataURL(type);
        if (onSave) onSave(dataUrl);
    };

    return (
        <div style={{ padding: 10 }}>
            <div style={{ border: '2px dashed #ddd', padding: 10, borderRadius: 8 }}>
                <canvas
                    ref={canvasRef}
                    disable={disable}
                    style={{ width: '100%', height, background: '#fff', borderRadius: 6 }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                />
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {/* <button onClick={undoLast} style={{ color: "white", backgroundColor: "#18273e" }}>Undo</button> */}
                <label>Pen Size: <input type="range" min="1" max="8" value={penWidth} onChange={e => setPenWidth(+e.target.value)} /></label>
                <label>Color: <input type="color" value={penColor} onChange={e => setPenColor(e.target.value)} /></label>
                <button onClick={clearCanvas} style={{ color: "white", borderRadius: 6, backgroundColor: "red" }}>Clear</button>
                {/* <button onClick={() => downloadImage('image/png')} style={{color:"white", backgroundColor:"#18273e"}}>Save PNG</button>
                <button onClick={() => downloadImage('image/jpeg')} style={{color:"white", backgroundColor:"#18273e"}}>Save JPG</button> */}
                {/* <button onClick={() => handleSave('image/png')} style={{ color: "white", backgroundColor: "#18273e" }}>Pass to Parent</button> */}
            </div>
        </div>
    );
};

export default Form_SignaturePad;
