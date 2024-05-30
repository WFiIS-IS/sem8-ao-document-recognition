from PySide6 import QtWidgets
from PySide6.QtWidgets import QGridLayout

from ui.widgets import UploadWidget, FindWidget, TableWidget

class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()
        # self.showFullScreen()
        self.setWindowTitle("PolDok")

        layout = QGridLayout()
        layout.addWidget(TableWidget(), 1, 0, 1, 2)
        layout.addWidget(UploadWidget(), 0, 0)
        layout.addWidget(FindWidget(), 0, 1)
        

        widget = QtWidgets.QWidget()
        widget.setLayout(layout)
        self.setCentralWidget(widget)