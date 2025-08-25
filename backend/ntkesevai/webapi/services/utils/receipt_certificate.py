# services/utils/certificate.py
from django.template.loader import get_template
from pathlib import Path
import os
import subprocess
from pdf2image import convert_from_path
from PIL import Image
import datetime
BASE_DIR = Path(__file__).resolve().parent.parent/"static"/"certificate"

def generate_certificate(service_request):
    print('request',service_request)
    print('request', service_request.first_name)
    print('request', service_request.last_name)
    print('request', service_request.email_id)
    now = datetime.datetime.now()
    formatted_date = now.strftime("%d/%m/%Y %I:%M:%S %p")

    template = get_template("cert.html")
    html = template.render({"service_request": service_request,"date": formatted_date})
    print('html data',html);
    wkhtml2pdf = subprocess.Popen((
        "wkhtmltopdf",
        "--print-media-type",
        "--enable-local-file-access",
        "--encoding", "UTF-8",
        "-", "-"
    ), stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    print('test2')
    wkdata = wkhtml2pdf.communicate(html.encode('utf8'))
    pdf_path = BASE_DIR/"certificate.pdf"
    with open(pdf_path, "wb") as f:
        f.write(wkdata[0])
    f.close()

    # Check if the PDF file exists and has content
    if not pdf_path.exists() or os.path.getsize(pdf_path) == 0:
        print("Error: The PDF file was not created or is empty.")
        # You might want to raise an exception or return a specific error here
        return None

    pages = convert_from_path(pdf_path, 500)
    for page in pages:
        page.save(BASE_DIR/"p_i.jpg", 'JPEG')

    img = Image.open(BASE_DIR/"p_i.jpg")
    box = (10, 1, 4130, 2620)
    area = img.crop(box)
    newsize = (3700, 2225)
    area = area.resize(newsize, Image.LANCZOS)
    final_path = BASE_DIR/"certif.jpg"
    area.save(final_path, 'jpeg')
    area.close()

    return final_path
