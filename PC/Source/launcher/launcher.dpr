program launcher;

uses
  Vcl.Forms,
  unt_l in 'unt_l.pas' {frmLauncher},
  mapshare in '..\Hamster\Public\mapshare.pas';

{$R *.res}

begin
  if not CheckForPrevInstanceLauncher then  Exit;
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.ShowMainForm := False;
  Application.CreateForm(TfrmLauncher, frmLauncher);
  Application.Run;
  ClearUpCheckForPrevInstanceLauncher;
end.
