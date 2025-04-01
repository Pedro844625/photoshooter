import React, { useState, useRef } from "react";

const TirarFoto = () => {
    const [status, setStatus] = useState("Aguardando autenticação...");
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [showPhoto, setShowPhoto] = useState(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            setStatus("Erro ao acessar a câmera: " + error.message);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);

            const imageBase64 = canvasRef.current.toDataURL("image/png");
            setPhoto(imageBase64);
            setShowPhoto(true);
        }
    };

    const closePhoto = () => {
        setPhoto(null);
        setShowPhoto(false);
    };

    const uploadPhoto = () => {
        if (!photo) {
            console.error("Nenhuma foto para enviar.");
            return;
        }

        fetch("https://seu-backend.com/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ photo }),
        })
            .then(response => response.json())
            .then(data => console.log("Foto salva no servidor:", data))
            .catch(error => console.error("Erro ao enviar a foto:", error));
    };

    return (
        <div className="container">
            <button onClick={startCamera} className="button">Ligar Câmera</button>
            <video ref={videoRef} autoPlay playsInline style={{ width: "700px", display: "block" }}></video>
            <button onClick={takePhoto} className="button">Tirar Foto</button>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

            {showPhoto && (
                <div>
                    <img src={photo} alt="Captura" style={{ width: "300px", marginTop: "10px" }} />
                    <button onClick={closePhoto} className="button">Fechar Foto</button>
                    <button onClick={uploadPhoto} className="button">Enviar Foto</button>
                </div>
            )}
        </div>
    );
};

export default TirarFoto;
