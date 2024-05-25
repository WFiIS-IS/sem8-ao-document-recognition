from PySide6 import QtWidgets, QtCore
import random

class MyWidget(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()

        self.hello = ["Hallo Welt", "Hei maailma", "Hola Mundo", "Привет мир"]

        self.button = QtWidgets.QPushButton("Click me!")
        self.text = QtWidgets.QLabel("Hello World",
                                     alignment=QtCore.Qt.AlignCenter)

        self.layout = QtWidgets.QVBoxLayout(self)
        self.layout.addWidget(self.text)
        self.layout.addWidget(self.button)

        self.button.clicked.connect(self.magic)

    @QtCore.Slot()
    def magic(self):
            self.text.setText(random.choice(self.hello))

class TableWidget(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()

        self.table = QtWidgets.QTableWidget(10, 10)
        self.table.setHorizontalHeaderLabels([f"Column {i}" for i in range(10)])
        self.table.setVerticalHeaderLabels([f"Row {i}" for i in range(10)])

        for i in range(10):
            for j in range(10):
                item = QtWidgets.QTableWidgetItem(f"Item {i}, {j}")
                self.table.setItem(i, j, item)

        self.layout = QtWidgets.QVBoxLayout(self)
        self.layout.addWidget(self.table)
