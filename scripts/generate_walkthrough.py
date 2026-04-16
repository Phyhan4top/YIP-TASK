from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.graphics.shapes import Drawing, Rect, String


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
PDF_PATH = DOCS_DIR / "Product-Upload-App-Walkthrough.pdf"


def ensure_dirs() -> None:
    DOCS_DIR.mkdir(exist_ok=True)


def create_preview(title: str, accent: colors.Color, editing: bool = False) -> Drawing:
    scale = 0.533

    def s(value: float) -> float:
        return value * scale

    drawing = Drawing(s(360), s(680))
    drawing.add(Rect(s(0), s(0), s(360), s(680), rx=s(30), ry=s(30), fillColor=colors.HexColor("#F4F6FB"), strokeColor=colors.HexColor("#D0D5DD")))
    drawing.add(Rect(s(18), s(18), s(324), s(644), rx=s(24), ry=s(24), fillColor=colors.white, strokeColor=colors.HexColor("#E4E7EC")))
    drawing.add(String(s(38), s(620), "React Native Product Upload", fontName="Helvetica-Bold", fontSize=s(10), fillColor=accent))
    drawing.add(String(s(38), s(592), title, fontName="Helvetica-Bold", fontSize=s(20), fillColor=colors.HexColor("#101828")))
    drawing.add(String(s(38), s(570), "Add a name, price, and image with instant validation.", fontName="Helvetica", fontSize=s(10), fillColor=colors.HexColor("#667085")))

    drawing.add(Rect(s(38), s(500), s(132), s(56), rx=s(12), ry=s(12), fillColor=colors.white, strokeColor=colors.HexColor("#D0D5DD")))
    drawing.add(String(s(54), s(534), "5" if editing else "3", fontName="Helvetica-Bold", fontSize=s(22), fillColor=colors.HexColor("#101828")))
    drawing.add(String(s(54), s(516), "Products saved", fontName="Helvetica", fontSize=s(9), fillColor=colors.HexColor("#667085")))

    drawing.add(Rect(s(190), s(500), s(132), s(56), rx=s(12), ry=s(12), fillColor=colors.white, strokeColor=colors.HexColor("#D0D5DD")))
    drawing.add(String(s(206), s(534), "0" if editing else "2", fontName="Helvetica-Bold", fontSize=s(22), fillColor=colors.HexColor("#101828")))
    drawing.add(String(s(206), s(516), "Slots remaining", fontName="Helvetica", fontSize=s(9), fillColor=colors.HexColor("#667085")))

    if editing:
        drawing.add(Rect(s(38), s(460), s(284), s(28), rx=s(10), ry=s(10), fillColor=colors.HexColor("#FEEFC6"), strokeColor=colors.HexColor("#F79009")))
        drawing.add(String(s(52), s(470), "Product limit reached (5 max)", fontName="Helvetica-Bold", fontSize=s(10), fillColor=colors.HexColor("#B54708")))

    form_y = 265 if editing else 290
    form_height = 180 if editing else 160
    drawing.add(Rect(s(38), s(form_y), s(284), s(form_height), rx=s(18), ry=s(18), fillColor=colors.white, strokeColor=colors.HexColor("#D0D5DD")))
    drawing.add(String(s(54), s(form_y + form_height - 24), "Edit product" if editing else "Add a product", fontName="Helvetica-Bold", fontSize=s(16), fillColor=colors.HexColor("#101828")))
    drawing.add(String(s(54), s(form_y + form_height - 48), "Product name", fontName="Helvetica-Bold", fontSize=s(9), fillColor=colors.HexColor("#344054")))
    drawing.add(Rect(s(54), s(form_y + form_height - 82), s(252), s(26), rx=s(8), ry=s(8), fillColor=colors.white, strokeColor=colors.HexColor("#D0D5DD")))
    drawing.add(String(s(66), s(form_y + form_height - 72), "Travel Mug", fontName="Helvetica", fontSize=s(10), fillColor=colors.HexColor("#101828")))
    drawing.add(String(s(54), s(form_y + form_height - 108), "Product price", fontName="Helvetica-Bold", fontSize=s(9), fillColor=colors.HexColor("#344054")))
    drawing.add(Rect(s(54), s(form_y + form_height - 142), s(252), s(26), rx=s(8), ry=s(8), fillColor=colors.white, strokeColor=colors.HexColor("#D0D5DD")))
    drawing.add(String(s(66), s(form_y + form_height - 132), "49.99", fontName="Helvetica", fontSize=s(10), fillColor=colors.HexColor("#101828")))

    preview_y = 118 if editing else 94
    preview_height = 110 if editing else 150
    drawing.add(Rect(s(54), s(preview_y), s(252), s(preview_height), rx=s(12), ry=s(12), fillColor=colors.HexColor("#D1E9FF"), strokeColor=colors.HexColor("#175CD3")))
    drawing.add(String(s(118), s(preview_y + preview_height / 2), "Image preview", fontName="Helvetica-Bold", fontSize=s(14), fillColor=colors.HexColor("#175CD3")))

    if editing:
        drawing.add(Rect(s(54), s(78), s(252), s(28), rx=s(14), ry=s(14), fillColor=accent, strokeColor=accent))
        drawing.add(String(s(132), s(88), "Update product", fontName="Helvetica-Bold", fontSize=s(10), fillColor=colors.white))
    else:
        drawing.add(Rect(s(54), s(54), s(252), s(28), rx=s(14), ry=s(14), fillColor=accent, strokeColor=accent))
        drawing.add(String(s(138), s(64), "Save product", fontName="Helvetica-Bold", fontSize=s(10), fillColor=colors.white))

    return drawing


def build_pdf() -> None:
    ensure_dirs()
    home_preview = create_preview("Add and manage up to five products.", colors.HexColor("#175CD3"))
    limit_preview = create_preview("Edit existing products even at the upload cap.", colors.HexColor("#0E9384"), editing=True)

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="TitleLarge", fontName="Helvetica-Bold", fontSize=20, leading=26, textColor=colors.HexColor("#101828"), spaceAfter=8))
    styles.add(ParagraphStyle(name="BodyCopy", fontName="Helvetica", fontSize=10.5, leading=16, textColor=colors.HexColor("#344054")))
    styles.add(ParagraphStyle(name="SectionTitle", fontName="Helvetica-Bold", fontSize=13, leading=18, textColor=colors.HexColor("#175CD3"), spaceAfter=6, spaceBefore=4))

    story = [
        Paragraph("Product Upload App Walkthrough", styles["TitleLarge"]),
        Paragraph(
            "This document summarizes the architecture, state management approach, key implementation decisions, and representative screen previews for the React Native product upload application.",
            styles["BodyCopy"],
        ),
        Spacer(1, 6),
        HRFlowable(width="100%", color=colors.HexColor("#D0D5DD")),
        Spacer(1, 10),
        Paragraph("Architecture decisions", styles["SectionTitle"]),
        ListFlowable(
            [
                ListItem(Paragraph("Expo + React Native were used to keep camera and gallery integration simple while maintaining a clean mobile-first developer workflow.", styles["BodyCopy"])),
                ListItem(Paragraph("The codebase is split into reusable components, a dedicated screen, context-driven state management, typed models, and utility helpers for validation and persistence.", styles["BodyCopy"])),
                ListItem(Paragraph("The product limit is enforced centrally in the context layer so the UI cannot bypass the five-product rule.", styles["BodyCopy"])),
            ],
            bulletType="bullet",
            leftIndent=12,
        ),
        Spacer(1, 8),
        Paragraph("State management approach", styles["SectionTitle"]),
        Table(
            [
                ["Layer", "Responsibility"],
                ["ProductContext", "Owns product CRUD operations, limit enforcement, hydration, and persistence side effects."],
                ["ProductForm", "Handles local input state, inline validation feedback, image preview, and image selection."],
                ["ProductUploadScreen", "Composes the screen, coordinates edit mode, and shows banners, alerts, and product cards."],
            ],
            colWidths=[46 * mm, 118 * mm],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#D1E9FF")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#101828")),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D0D5DD")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                    ("LEADING", (0, 0), (-1, -1), 13),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                ]
            ),
        ),
        Spacer(1, 10),
        Paragraph("Key challenges and solutions", styles["SectionTitle"]),
        ListFlowable(
            [
                ListItem(Paragraph("Challenge: keeping the upload cap strict without blocking legitimate edits. Solution: disable new uploads when five items exist, but still allow update and delete actions for existing products.", styles["BodyCopy"])),
                ListItem(Paragraph("Challenge: providing fast feedback for invalid data. Solution: inline validation is handled in the form while the context revalidates on save as a final guardrail.", styles["BodyCopy"])),
                ListItem(Paragraph("Challenge: preserving data between app sessions. Solution: the provider hydrates from AsyncStorage on launch and persists every product list change.", styles["BodyCopy"])),
            ],
            bulletType="bullet",
            leftIndent=12,
        ),
        Spacer(1, 10),
        Paragraph("Representative screen previews", styles["SectionTitle"]),
        Paragraph("Main upload flow", styles["BodyCopy"]),
        Spacer(1, 4),
        home_preview,
        Spacer(1, 8),
        Paragraph("Limit reached and edit flow", styles["BodyCopy"]),
        Spacer(1, 4),
        limit_preview,
    ]

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )
    doc.build(story)


if __name__ == "__main__":
    build_pdf()
