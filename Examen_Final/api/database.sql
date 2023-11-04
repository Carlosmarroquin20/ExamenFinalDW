USE [master]
GO

/****** Object:  Database [Alumno]    Script Date: 30/09/2023 12:15:10 ******/
CREATE DATABASE [Alumno]

CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NOT NULL,
	[pass] [varchar](100) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[status] [varchar](3) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
