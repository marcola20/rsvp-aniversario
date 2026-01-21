// Código para Google Apps Script

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    var data = JSON.parse(e.postData.contents);
    
    var timestamp = new Date(data.timestamp);
    var dataFormatada = Utilities.formatDate(timestamp, "GMT-3", "dd/MM/yyyy HH:mm:ss");
    
    data.guests.forEach(function(guest) {
      var row = [
        dataFormatada,                    // Data/Hora
        guest.name,                       // Nome
        guest.ageCategory,                // Adulto/Criança
        data.message || '',               // Mensagem
        data.totalGuests,                 // Total de convidados do grupo
        data.adults,                      // Total de adultos do grupo
        data.children                     // Total de crianças do grupo
      ];
      
      sheet.appendRow(row);
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Confirmação registrada com sucesso!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("API do RSVP - Ravi 1 Aninho 🦖")
    .setMimeType(ContentService.MimeType.TEXT);
}

function configurarPlanilha() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  sheet.setName("Confirmações RSVP");
  
  var headers = [
    "Data/Hora",
    "Nome do Convidado",
    "Tipo (Adulto/Criança)",
    "Mensagem",
    "Total Grupo",
    "Adultos Grupo",
    "Crianças Grupo"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#4ECDC4")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  
  sheet.setColumnWidth(1, 150);  // Data/Hora
  sheet.setColumnWidth(2, 200);  // Nome
  sheet.setColumnWidth(3, 120);  // Tipo
  sheet.setColumnWidth(4, 300);  // Mensagem
  sheet.setColumnWidth(5, 100);  // Total Grupo
  sheet.setColumnWidth(6, 120);  // Adultos
  sheet.setColumnWidth(7, 120);  // Crianças
  
  sheet.setFrozenRows(1);
  
  Logger.log("Planilha configurada com sucesso!");
}

function criarEstatisticas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("Confirmações RSVP");
  
  var statsSheet = ss.getSheetByName("Estatísticas");
  if (!statsSheet) {
    statsSheet = ss.insertSheet("Estatísticas");
  } else {
    statsSheet.clear();
  }
  
  statsSheet.getRange("A1").setValue("📊 ESTATÍSTICAS - Aniversário do Ravi");
  statsSheet.getRange("A1").setFontSize(16).setFontWeight("bold").setFontColor("#FF8C42");
  
  statsSheet.getRange("A3").setValue("Total de Confirmações:");
  statsSheet.getRange("B3").setFormula('=COUNTA(\'Confirmações RSVP\'!B2:B)');
  
  statsSheet.getRange("A4").setValue("Total de Adultos:");
  statsSheet.getRange("B4").setFormula('=COUNTIF(\'Confirmações RSVP\'!C2:C,"adulto")');
  
  statsSheet.getRange("A5").setValue("Total de Crianças:");
  statsSheet.getRange("B5").setFormula('=COUNTIF(\'Confirmações RSVP\'!C2:C,"crianca")');
  
  statsSheet.getRange("A7").setValue("Última Confirmação:");
  statsSheet.getRange("B7").setFormula('=MAX(\'Confirmações RSVP\'!A2:A)');
  
  statsSheet.getRange("A3:A7").setFontWeight("bold");
  statsSheet.getRange("B3:B7").setHorizontalAlignment("center");
  statsSheet.setColumnWidth(1, 200);
  statsSheet.setColumnWidth(2, 150);
  
  Logger.log("Estatísticas criadas com sucesso!");
}
