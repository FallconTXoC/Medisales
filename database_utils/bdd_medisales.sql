#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------

SET NAMES latin1;

#------------------------------------------------------------
# Table: PrincipeActif
#------------------------------------------------------------

CREATE TABLE PrincipeActif(
        CodeMol     Varchar (10) NOT NULL ,
        Libelle     Varchar (40) NOT NULL ,
        Description Varchar (200) NOT NULL
	,CONSTRAINT PrincipeActif_PK PRIMARY KEY (CodeMol)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Symptome
#------------------------------------------------------------

CREATE TABLE Symptome(
        CodeSympt   Varchar (20) NOT NULL ,
        Libelle     Varchar (50) NOT NULL ,
        Description Varchar (200) NOT NULL
	,CONSTRAINT Symptome_PK PRIMARY KEY (CodeSympt)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Utilisateur
#------------------------------------------------------------

CREATE TABLE Utilisateur(
        ID     Varchar (20) NOT NULL ,
        Nom    Varchar (30) NOT NULL ,
        Prenom Varchar (30) NOT NULL ,
        Passwd Varchar (255) NOT NULL
	,CONSTRAINT Utilisateur_PK PRIMARY KEY (ID)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Client
#------------------------------------------------------------

CREATE TABLE Client(
        CodeClient Varchar (5) NOT NULL ,
        Nom        Varchar (30) NOT NULL ,
        Type       Varchar (20) NOT NULL ,
        Mail       Varchar (100) NOT NULL ,
        Adresse    Varchar (100) NOT NULL ,
        Ville      Varchar (50) NOT NULL ,
        CP         Varchar (5) NOT NULL
	,CONSTRAINT Client_PK PRIMARY KEY (CodeClient)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Objectif
#------------------------------------------------------------

CREATE TABLE Objectif(
        ID        Varchar (20) NOT NULL ,
        CodeObj   Varchar (15) NOT NULL ,
        DateDebut Date NOT NULL ,
        DateFin   Date NOT NULL ,
        QttVentes Int NOT NULL ,
        Complete  Bool NOT NULL
	,CONSTRAINT Objectif_PK PRIMARY KEY (ID,CodeObj,DateDebut,DateFin)

	,CONSTRAINT Objectif_Utilisateur_FK FOREIGN KEY (ID) REFERENCES Utilisateur(ID)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Maladie
#------------------------------------------------------------

CREATE TABLE Maladie(
        CodeMaladie Varchar (10) NOT NULL ,
        Libelle     Varchar (100) NOT NULL ,
        Description Varchar (250) NOT NULL
	,CONSTRAINT Maladie_PK PRIMARY KEY (CodeMaladie)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Forme
#------------------------------------------------------------

CREATE TABLE Forme(
        CodeForme   Varchar (10) NOT NULL ,
        Libelle     Varchar (100) NOT NULL ,
        Description Varchar (250) NOT NULL
	,CONSTRAINT Forme_PK PRIMARY KEY (CodeForme)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: VoieAdmin
#------------------------------------------------------------

CREATE TABLE VoieAdmin(
        CodeVoieAdmin Varchar (10) NOT NULL ,
        Libelle       Varchar (100) NOT NULL ,
        Description   Varchar (250) NOT NULL
	,CONSTRAINT VoieAdmin_PK PRIMARY KEY (CodeVoieAdmin)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Produit
#------------------------------------------------------------

CREATE TABLE Produit(
        CodeProd      Varchar (15) NOT NULL ,
        Libelle       Varchar (40) NOT NULL ,
        Description   Varchar (200) NOT NULL ,
        Prix          Float NOT NULL ,
        CodeVoieAdmin Varchar (10) NOT NULL ,
        CodeForme     Varchar (10) NOT NULL
	,CONSTRAINT Produit_PK PRIMARY KEY (CodeProd)

	,CONSTRAINT Produit_VoieAdmin_FK FOREIGN KEY (CodeVoieAdmin) REFERENCES VoieAdmin(CodeVoieAdmin)
	,CONSTRAINT Produit_Forme0_FK FOREIGN KEY (CodeForme) REFERENCES Forme(CodeForme)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Contrat
#------------------------------------------------------------

CREATE TABLE Contrat(
        ID                Varchar (20) NOT NULL ,
        CodeClient        Varchar (5) NOT NULL ,
        CodeProd          Varchar (15) NOT NULL ,
        Date              Date NOT NULL ,
        QTT               Int NOT NULL ,
        DateFin           Date NOT NULL ,
        Frequence         Int NOT NULL ,
        ID_Utilisateur    Varchar (20) NOT NULL ,
        CodeClient_Conclu Varchar (5) NOT NULL ,
        CodeProd_Produit  Varchar (15) NOT NULL
	,CONSTRAINT Contrat_PK PRIMARY KEY (ID)

	,CONSTRAINT Contrat_Utilisateur_FK FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateur(ID)
	,CONSTRAINT Contrat_Client0_FK FOREIGN KEY (CodeClient_Conclu) REFERENCES Client(CodeClient)
	,CONSTRAINT Contrat_Produit1_FK FOREIGN KEY (CodeProd_Produit) REFERENCES Produit(CodeProd)
)ENGINE=InnoDB;

#------------------------------------------------------------
# Table: Contient
#------------------------------------------------------------

CREATE TABLE Prod_Contient(
        CodeProd Varchar (15) NOT NULL ,
        CodeMol  Varchar (10) NOT NULL
    	,CONSTRAINT Contient_PK PRIMARY KEY (CodeProd,CodeMol)

    	,CONSTRAINT Contient_Produit_FK FOREIGN KEY (CodeProd) REFERENCES Produit(CodeProd)
    	,CONSTRAINT Contient_PrincipeActif0_FK FOREIGN KEY (CodeMol) REFERENCES PrincipeActif(CodeMol)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Usage
#------------------------------------------------------------

CREATE TABLE Prod_Usage(
        CodeProd  Varchar (15) NOT NULL ,
        CodeSympt Varchar (20) NOT NULL
    	,CONSTRAINT Usage_PK PRIMARY KEY (CodeProd,CodeSympt)

    	,CONSTRAINT Usage_Produit_FK FOREIGN KEY (CodeProd) REFERENCES Produit(CodeProd)
    	,CONSTRAINT Usage_Symptome0_FK FOREIGN KEY (CodeSympt) REFERENCES Symptome(CodeSympt)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Combat
#------------------------------------------------------------

CREATE TABLE Prod_Combat(
        CodeProd    Varchar (15) NOT NULL,
        CodeMaladie Varchar (10) NOT NULL
    	,CONSTRAINT Combat_PK PRIMARY KEY (CodeMaladie,CodeProd)

    	,CONSTRAINT Combat_Maladie_FK FOREIGN KEY (CodeMaladie) REFERENCES Maladie(CodeMaladie)
    	,CONSTRAINT Combat_Produit0_FK FOREIGN KEY (CodeProd) REFERENCES Produit(CodeProd)
)ENGINE=InnoDB;


INSERT INTO Forme VALUES("SOL","Solide","Forme solide");
INSERT INTO Forme VALUES("LIQ","Liquide","Forme liquide");
INSERT INTO Forme VALUES("LYO","Lyoc","Forme lyoc (comprim� sublingual)");


INSERT INTO VoieAdmin VALUES("ORL","Orale","Administration par la bouche");
INSERT INTO VoieAdmin VALUES("ANL","Anale","Administration par l anus");
INSERT INTO VoieAdmin VALUES("LYOPH","Lyophilisat","Administration par seringue intraveineuse");
INSERT INTO VoieAdmin VALUES("SERMUSC","Seringue intramusculaire","Administration par seringue intramusculaire");
INSERT INTO VoieAdmin VALUES("GTT","Gouttes","Administration par gouttes");
INSERT INTO VoieAdmin VALUES("PNAS","Per-nasale","Administration par le nez");


INSERT INTO Symptome VALUES("FVR","Fi�vre","Fri�ve l�g�re � mod�r�e");
INSERT INTO Symptome VALUES("TXGRA","Toux grasse","Toux grasse");
INSERT INTO Symptome VALUES("TXSEC","Toux s�che","Toux s�che");
INSERT INTO Symptome VALUES("MXTT_G","Maux de t�te graves","Maux de t�te forts");
INSERT INTO Symptome VALUES("MXABDO","Douleurs abdominales","Douleurs abdominales l�g�res � mod�r�es");
INSERT INTO Symptome VALUES("MXTT_LM","Maux de t�te l�gers/mod�r�s","Maux de t�te l�gers � mod�r�s");
INSERT INTO Symptome VALUES("DIAR","Diarrh�e","Diarrh�e");
INSERT INTO Symptome VALUES("CSTIP","Constipation","Constipation");


INSERT INTO PrincipeActif VALUES("DISMCTT","Diosmectite","Silicate double d aluminium et de magn�sium, structure en feuillets et viscosit� plastique �lev�e");
INSERT INTO PrincipeActif VALUES("AMMCHLOR","Ammonii chloridium","Chlorure d amonium, irrite les muqueuses et les bronches");
INSERT INTO PrincipeActif VALUES("GUAFNSN","Gua�f�n�sine","Expectorant pour les glaires");
INSERT INTO PrincipeActif VALUES("CRBCYSN","Carbocyst�ine","Mucolytique d�riv� d acide amin� soufr�");
INSERT INTO PrincipeActif VALUES("SMTRIPT","Sumatriptan","Biodisponibilit� faible");
INSERT INTO PrincipeActif VALUES("PHLORGLCNL","Phloroglucinol","Antispasmodique");
INSERT INTO PrincipeActif VALUES("LOPRMD","Lop�ramide","Antidiarrh�ique, agoniste opio�de des r�cepteurs �");
INSERT INTO PrincipeActif VALUES("ANTHRQNN","Anthraquinone","Hydrocarbure aromatique polycyclique");


INSERT INTO Maladie VALUES("GRPA","Grippe type A","Virus grippaux A(H1N1) et A(H3N2)");
INSERT INTO Maladie VALUES("GRPB","Grippe type B","Virus grippaux B/Yamagata et B/Victoria");
INSERT INTO Maladie VALUES("GRPC","Grippe type C","Virus grippaux de type C");
INSERT INTO Maladie VALUES("BRCHT","Bronchite","Inflammation des bronches");
INSERT INTO Maladie VALUES("RHINPHRGT","Rhinopharyngite","Infection virale avec �coulements nasaux");
INSERT INTO Maladie VALUES("MIGRN","Migraine","Mal de t�te pulsatile");
INSERT INTO Maladie VALUES("GASTRENT","Grastro-ent�rite","Inflammation de la paroi de l estomac et de l intestin");
INSERT INTO Maladie VALUES("CONSTPTN","Constipation","Difficult�es d �vacuation des d�chets intestinaux");


INSERT INTO Produit VALUES("P0001","Miraculus","Pour tout, partout. Avec Miraculus la maladie n est plus !","1000","ORL","SOL");
INSERT INTO Produit VALUES("P0002","Abracadicus","Pour tous, partout. Avec Abracadicus la maladie n est presque plus !","600","ORL","LIQ");
INSERT INTO Produit VALUES("P0003","Magimicinal","Pour presque tout, presque partout. De la magie ? Non, de la science !","400","PNAS","LIQ");
INSERT INTO Produit VALUES("P0004","Oudinimatol","Une maladie, un sympt�me ? Hop ! Plus l�.","250.4","GTT","LIQ");
INSERT INTO Produit VALUES("P0005","Vidtou","M�me l A86 ne r�sisterait pas � son effet !","110.3","ANL","SOL");
INSERT INTO Produit VALUES("P0006","Plumalocrane","Pour toutes ces fois o� un marteau vous attaque la t�te !","140","LYOPH","SOL");
INSERT INTO Produit VALUES("P0007","Bouchtou","Au cas o� vous abusiez du Vidtou.","200.56","ANL","SOL");


INSERT INTO Prod_Contient VALUES ("P0001","AMMCHLOR");
INSERT INTO Prod_Contient VALUES ("P0001","CRBCYSN");
INSERT INTO Prod_Contient VALUES ("P0001","SMTRIPT");
INSERT INTO Prod_Contient VALUES ("P0002","GUAFNSN");
INSERT INTO Prod_Contient VALUES ("P0002","PHLORGLCNL");
INSERT INTO Prod_Contient VALUES ("P0002","SMTRIPT");
INSERT INTO Prod_Contient VALUES ("P0003","AMMCHLOR");
INSERT INTO Prod_Contient VALUES ("P0003","SMTRIPT");
INSERT INTO Prod_Contient VALUES ("P0004","GUAFNSN");
INSERT INTO Prod_Contient VALUES ("P0005","ANTHRQNN");
INSERT INTO Prod_Contient VALUES ("P0006","SMTRIPT");
INSERT INTO Prod_Contient VALUES ("P0007","LOPRMD");


INSERT INTO Prod_Usage VALUES ("P0001","FVR");
INSERT INTO Prod_Usage VALUES ("P0001","TXGRA");
INSERT INTO Prod_Usage VALUES ("P0001","TXSEC");
INSERT INTO Prod_Usage VALUES ("P0001","MXTT_G");
INSERT INTO Prod_Usage VALUES ("P0001","MXABDO");
INSERT INTO Prod_Usage VALUES ("P0001","MXTT_LM");
INSERT INTO Prod_Usage VALUES ("P0001","DIAR");
INSERT INTO Prod_Usage VALUES ("P0002","FVR");
INSERT INTO Prod_Usage VALUES ("P0002","TXGRA");
INSERT INTO Prod_Usage VALUES ("P0002","TXSEC");
INSERT INTO Prod_Usage VALUES ("P0002","MXTT_G");
INSERT INTO Prod_Usage VALUES ("P0002","MXTT_LM");
INSERT INTO Prod_Usage VALUES ("P0002","MXABDO");
INSERT INTO Prod_Usage VALUES ("P0003","FVR");
INSERT INTO Prod_Usage VALUES ("P0003","TXGRA");
INSERT INTO Prod_Usage VALUES ("P0003","TXSEC");
INSERT INTO Prod_Usage VALUES ("P0003","MXTT_LM");
INSERT INTO Prod_Usage VALUES ("P0004","FVR");
INSERT INTO Prod_Usage VALUES ("P0004","TXSEC");
INSERT INTO Prod_Usage VALUES ("P0004","MXTT_LM");
INSERT INTO Prod_Usage VALUES ("P0005","CSTIP");
INSERT INTO Prod_Usage VALUES ("P0006","MXTT_G");
INSERT INTO Prod_Usage VALUES ("P0007","DIAR");


INSERT INTO Prod_Combat VALUES ("P0001","GRPA");
INSERT INTO Prod_Combat VALUES ("P0001","GRPB");
INSERT INTO Prod_Combat VALUES ("P0001","GRPC");
INSERT INTO Prod_Combat VALUES ("P0001","BRCHT");
INSERT INTO Prod_Combat VALUES ("P0001","RHINPHRGT");
INSERT INTO Prod_Combat VALUES ("P0001","MIGRN");
INSERT INTO Prod_Combat VALUES ("P0001","GASTRENT");
INSERT INTO Prod_Combat VALUES ("P0002","GRPA");
INSERT INTO Prod_Combat VALUES ("P0002","GRPB");
INSERT INTO Prod_Combat VALUES ("P0002","GRPC");
INSERT INTO Prod_Combat VALUES ("P0002","BRCHT");
INSERT INTO Prod_Combat VALUES ("P0002","RHINPHRGT");
INSERT INTO Prod_Combat VALUES ("P0002","MIGRN");
INSERT INTO Prod_Combat VALUES ("P0003","GRPA");
INSERT INTO Prod_Combat VALUES ("P0003","GRPB");
INSERT INTO Prod_Combat VALUES ("P0003","GRPC");
INSERT INTO Prod_Combat VALUES ("P0003","BRCHT");
INSERT INTO Prod_Combat VALUES ("P0003","RHINPHRGT");
INSERT INTO Prod_Combat VALUES ("P0004","GRPB");
INSERT INTO Prod_Combat VALUES ("P0004","BRCHT");
INSERT INTO Prod_Combat VALUES ("P0004","RHINPHRGT");
INSERT INTO Prod_Combat VALUES ("P0005","CONSTPTN");
INSERT INTO Prod_Combat VALUES ("P0006","MIGRN");
INSERT INTO Prod_Combat VALUES ("P0007","GASTRENT");

CREATE USER 'medisales_server'@'%' IDENTIFIED BY 'KzvyfaJ%2R9BR!+';
GRANT INSERT ON Medisales.* TO 'medisales_server'@'%';
GRANT SELECT ON Medisales.* TO 'medisales_server'@'%';
GRANT UPDATE ON Medisales.* TO 'medisales_server'@'%';
GRANT DELETE ON Medisales.* TO 'medisales_server'@'%';
