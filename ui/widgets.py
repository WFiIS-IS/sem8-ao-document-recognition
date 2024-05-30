from PySide6 import QtWidgets, QtCore
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QPushButton, QFileDialog, QTableWidgetItem, QDialog, QVBoxLayout, QLabel, QLineEdit, QAbstractItemView, QMessageBox
from PySide6.QtCore import Qt
import requests
import os
from types import SimpleNamespace

stubData = [
    {"id": 1, "first_name": "Dummy", "last_name": "DataShowing", "pesel": "90090512345"},
    {"id": 2, "first_name": "Jan", "last_name": "Kowalski", "pesel": "90090512345"},
    {"id": 3, "first_name": "Anna", "last_name": "Nowak", "pesel": "90110512345"}
]

class UploadWidget(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()

        self.title = QtWidgets.QLabel("Enter data through photo",
                                      alignment=QtCore.Qt.AlignCenter)
        self.button = QtWidgets.QPushButton("Upload Photo")
        self.text = QtWidgets.QLabel("No photo selected",
                                     alignment=QtCore.Qt.AlignCenter)
        self.image_label = QtWidgets.QLabel(alignment=QtCore.Qt.AlignCenter)

        self.layout = QtWidgets.QVBoxLayout(self)
        self.layout.addWidget(self.title)
        self.layout.addWidget(self.text)
        self.layout.addWidget(self.image_label)
        self.layout.addWidget(self.button)

        self.button.clicked.connect(self.upload_photo)

    @QtCore.Slot()
    def upload_photo(self):
        file_dialog = QFileDialog()
        file_path, _ = file_dialog.getOpenFileName(self, "Select Photo", "", "Images (*.png *.xpm *.jpg)")
        
        if file_path:
            file_name = os.path.basename(file_path)
            self.text.setText(f"Selected photo: {file_name}")
            pixmap = QPixmap(file_path)
            self.image_label.setPixmap(pixmap.scaled(200, 200, QtCore.Qt.KeepAspectRatio))
            
            with open(file_path, 'rb') as f:
                response = requests.post('http://localhost:8000/upload', files={'file': f})

            if response.status_code == 200:
                print("File uploaded successfully")
            else:
                print(f"Failed to upload file, status code: {response.status_code}")
            
class FindWidget(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()

        self.title = QtWidgets.QLabel("Enter written data",
                                      alignment=QtCore.Qt.AlignCenter)
        self.button = QtWidgets.QPushButton("Upload Photo")
        self.text = QtWidgets.QLabel("No photo selected",
                                     alignment=QtCore.Qt.AlignCenter)
        self.image_label = QtWidgets.QLabel(alignment=QtCore.Qt.AlignCenter)

        self.layout = QtWidgets.QVBoxLayout(self)
        self.layout.addWidget(self.title)
        self.layout.addWidget(self.text)
        self.layout.addWidget(self.image_label)
        self.layout.addWidget(self.button)

        self.button.clicked.connect(self.upload_photo)

    @QtCore.Slot()
    def upload_photo(self):
        file_dialog = QFileDialog()
        file_path, _ = file_dialog.getOpenFileName(self, "Select Photo", "", "Images (*.png *.xpm *.jpg)")
        
        if file_path:
            file_name = os.path.basename(file_path)
            self.text.setText(f"Selected photo: {file_name}")
            pixmap = QPixmap(file_path)
            self.image_label.setPixmap(pixmap.scaled(200, 200, QtCore.Qt.KeepAspectRatio))
            
            with open(file_path, 'rb') as f:
                response = requests.post('http://localhost:8000/', files={'file': f})


            if response.status_code == 200:
                print("File uploaded successfully")
            else:
                print(f"Failed to upload file, status code: {response.status_code}")
                
class EditDialog(QDialog):
    def __init__(self, person, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Edit Person")
        self.person = person
        self.layout = QVBoxLayout()

        self.firstNameLabel = QLabel("First Name")
        self.firstNameEdit = QLineEdit(person['first_name'])
        self.layout.addWidget(self.firstNameLabel)
        self.layout.addWidget(self.firstNameEdit)

        self.lastNameLabel = QLabel("Last Name")
        self.lastNameEdit = QLineEdit(person['last_name'])
        self.layout.addWidget(self.lastNameLabel)
        self.layout.addWidget(self.lastNameEdit)

        self.peselLabel = QLabel("PESEL")
        self.peselEdit = QLineEdit(person['pesel'])
        self.layout.addWidget(self.peselLabel)
        self.layout.addWidget(self.peselEdit)

        self.saveButton = QPushButton("Save")
        self.saveButton.clicked.connect(self.accept)
        self.layout.addWidget(self.saveButton)

        self.setLayout(self.layout)
        
    def save(self):
        data = {
            'id': self.person['id'],
            'first_name': self.firstNameEdit.text(),
            'last_name': self.lastNameEdit.text(),
            'pesel': self.peselEdit.text()
        }
        try:
            response = requests.post('http://localhost:8000/edit_data', json=data)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False

class TableWidget(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()

        self.table = QtWidgets.QTableWidget(0, 4)
        self.table.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.table.setHorizontalHeaderLabels(["First Name", "Last Name", "PESEL", "Edit"])

        self.layout = QtWidgets.QVBoxLayout(self)
        self.layout.addWidget(self.table)

        self.fetch_data()

    def fetch_data(self):
        try:
            response = requests.get('http://localhost:8000/fetch_data')
        except requests.exceptions.ConnectionError:
            print("Unable to connect to the server. Please make sure the server is running.")
            response = SimpleNamespace(status_code=400) 
        if response.status_code == 200:
            data = response.json()
        else:
            data = stubData
            print(f"Failed to fetch data, status code: {response.status_code}")
        
        for i, person in enumerate(data):
            self.table.insertRow(i)
            
            item = QTableWidgetItem(person['first_name'])
            item.setData(Qt.UserRole, person['id'])
            self.table.setItem(i, 0, item)

            self.table.setItem(i, 1, QTableWidgetItem(person['last_name']))
            self.table.setItem(i, 2, QTableWidgetItem(person['pesel']))
            
            button = QPushButton("Edit")
            button.clicked.connect(self.handleButtonClicked)
            self.table.setCellWidget(i, 3, button)
            
    def handleButtonClicked(self):
        button = self.sender()
        index = self.table.indexAt(button.pos())
        if index.isValid():
            row = index.row()
            person = {
                'id': self.table.item(row, 0).data(Qt.UserRole),
                'first_name': self.table.item(row, 0).text(),
                'last_name': self.table.item(row, 1).text(),
                'pesel': self.table.item(row, 2).text()
            }
            dialog = EditDialog(person, self)
            if dialog.exec():
                if not dialog.save():
                    msgBox = QMessageBox()
                    msgBox.setIcon(QMessageBox.Warning)
                    msgBox.setText("Could not connect to the backend.")
                    msgBox.setWindowTitle("Connection Error")
                    msgBox.exec()
                self.table.item(row, 1).setText(dialog.firstNameEdit.text())
                self.table.item(row, 2).setText(dialog.lastNameEdit.text())
                self.table.item(row, 3).setText(dialog.peselEdit.text())

