import os
# Disable MSMF backend priority on Windows to eliminate -1072875772 grab errors
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"

import cv2  # type: ignore
import time

# Dataset folder path
DATASET_DIR = os.path.join(os.path.dirname(__file__), "../data/face_dataset")
os.makedirs(DATASET_DIR, exist_ok=True)

ANGLES = [
    ("Front Face", 5),
    ("Turn Slightly Left", 4),
    ("Turn Slightly Right", 4),
    ("Tilt Head Slightly Up", 3),
    ("Tilt Head Slightly Down", 3),
]

def init_camera():
    """Initialize camera using DirectShow (CAP_DSHOW) to prevent MSMF errors on Windows."""
    print("[*] Accessing webcam using DirectShow driver...")
    
    # Try camera index 0, then 1, then 2 with CAP_DSHOW
    for index in [0, 1, 2]:
        cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
        if cap.isOpened():
            # Test frame grab
            for _ in range(5):
                ret, frame = cap.read()
                if ret and frame is not None:
                    print(f"[+] Webcam connected successfully on Camera Index {index} (DirectShow).")
                    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                    return cap
            cap.release()

    # Fallback attempt
    cap = cv2.VideoCapture(0)
    if cap.isOpened():
        print("[+] Webcam connected with default driver.")
        return cap

    return None

def capture_face_dataset():
    print("=" * 60)
    print("📸 Admin Multi-Angle Face Dataset Capture Tool")
    print("=" * 60)
    print("Instructions:")
    print(" 1. Position yourself in front of the camera with clear lighting.")
    print(" 2. Follow the pose prompt shown at the top of the video window.")
    print(" 3. Press SPACEBAR to capture each photo for the current pose.")
    print(" 4. Press 'q' or ESC anytime to exit.")
    print("=" * 60)

    cap = init_camera()
    if not cap:
        print("\n❌ Error: Cannot access webcam.")
        print("Please check your camera connection or close any other app using the webcam.")
        return

    total_captured = 0

    for angle_label, count_needed in ANGLES:
        captured_for_angle = 0
        print(f"\n👉 Current Pose Target: [{angle_label}] — Need {count_needed} photos")

        while captured_for_angle < count_needed:
            ret, frame = cap.read()
            if not ret or frame is None:
                time.sleep(0.02)
                continue

            # Mirror frame for natural preview
            flipped_frame = cv2.flip(frame, 1)
            display_frame = flipped_frame.copy()

            h, w, _ = display_frame.shape
            center_x, center_y = w // 2, h // 2

            # Draw target oval guide
            cv2.ellipse(display_frame, (center_x, center_y), (140, 175), 0, 0, 360, (255, 215, 0), 2)
            cv2.circle(display_frame, (center_x, center_y), 4, (0, 255, 255), -1)

            # Header info overlay
            cv2.rectangle(display_frame, (0, 0), (w, 90), (15, 23, 42), -1)
            cv2.putText(display_frame, f"Pose: {angle_label}", (20, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.85, (255, 255, 255), 2)
            cv2.putText(display_frame, f"Photos Captured: {captured_for_angle}/{count_needed}", (20, 75),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 255), 2)

            # Footer prompt overlay
            cv2.rectangle(display_frame, (0, h - 45), (w, h), (15, 23, 42), -1)
            cv2.putText(display_frame, "Press SPACE to Capture Photo | Press Q to Quit", (20, h - 15),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 200, 200), 1)

            cv2.imshow("Star AI Lab - Face Dataset Capture", display_frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == 27:
                print("\n🛑 Capture stopped by user.")
                cap.release()
                cv2.destroyAllWindows()
                return
            elif key == 32:  # SPACEBAR
                total_captured += 1
                captured_for_angle += 1
                
                filename = f"admin_face_{total_captured:02d}_{angle_label.replace(' ', '_').lower()}.jpg"
                filepath = os.path.join(DATASET_DIR, filename)

                # Save raw camera frame
                cv2.imwrite(filepath, flipped_frame)
                
                # Visual confirmation flash
                flash = display_frame.copy()
                cv2.rectangle(flash, (0, 0), (w, h), (0, 255, 0), 10)
                cv2.putText(flash, "PHOTO SAVED!", (center_x - 100, center_y),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 3)
                cv2.imshow("Star AI Lab - Face Dataset Capture", flash)
                cv2.waitKey(200)

                print(f"  ✓ Saved [{captured_for_angle}/{count_needed}]: {filename}")
                time.sleep(0.2)

    cap.release()
    cv2.destroyAllWindows()

    print("\n" + "=" * 60)
    print(f"✅ Success! Captured {total_captured} dataset photos across 5 face angles.")
    print(f"📁 Dataset location: {DATASET_DIR}")
    print("=" * 60)
    print("\n👉 Next step: Run 'python scripts/process_face_dataset.py' to train your admin profile!")

if __name__ == "__main__":
    capture_face_dataset()
