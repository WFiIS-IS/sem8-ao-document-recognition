import sys
from PySide6 import QtGui, QtWidgets
from ui.window import MainWindow

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)

    # Styling of app
    app.setAttribute(QtGui.Qt.AA_EnableHighDpiScaling, True)
    app.setAttribute(QtGui.Qt.AA_UseHighDpiPixmaps, True)
    app.setStyleSheet("QLabel{font-size: 18pt;}")

    window = MainWindow()
    window.resize(1000, 800)
    window.show()
    sys.exit(app.exec())