import fitz  
import os
import json

class PDFExtractor:
    def __init__(self, pdf_dir):
        self.pdf_dir = pdf_dir

    def extract_main_topic(self, pdf_path):
        try:
            doc = fitz.open(pdf_path)
           
            main_topic = doc.metadata.get("title", "")
            if not main_topic:
                main_topic = os.path.splitext(os.path.basename(pdf_path))[0]
            doc.close()
            return main_topic
        except Exception as e:
            print(f"Error extracting topic from {pdf_path}: {str(e)}")
            return os.path.splitext(os.path.basename(pdf_path))[0]

    def process_pdf(self, pdf_path):
        main_topic = self.extract_main_topic(pdf_path)
        return {
            "metadata": {
                "file_name": os.path.basename(pdf_path),
                "title": main_topic
            }
        }

    def process_directory(self):
        results = []
        for filename in os.listdir(self.pdf_dir):
            if filename.lower().endswith('.pdf'):
                pdf_path = os.path.join(self.pdf_dir, filename)
                result = self.process_pdf(pdf_path)
                results.append(result)
        return results

def main():
    pdf_dir = "C:\\Users\\anmol\\OneDrive\\Desktop\\Search_engine\\pdf_dir"
    extractor = PDFExtractor(pdf_dir)
    results = extractor.process_directory()
    
    with open("extracted_data.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()